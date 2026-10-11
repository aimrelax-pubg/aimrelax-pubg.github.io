
import Foundation
import Combine
import Supabase
import LiveKit

@MainActor
final class LiveController: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var streamerName = "AIMRELAX"
    @Published var title = "AIMRELAX PUBG LIVE"
    @Published var isSignedIn = false
    @Published var isLive = false
    @Published var micEnabled = true
    @Published var isBusy = false
    @Published var status = "Մուտք գործիր AIMRELAX-ի քո հաշիվով։"

    private let supabase = SupabaseClient(
        supabaseURL: AppConfig.supabaseURL,
        supabaseKey: AppConfig.supabaseAnonKey
    )

    private var room: Room?
    private var streamID: String?

    private struct CreatedLive: Decodable {
        let stream: Stream
        let room_name: String?
    }

    private struct Stream: Decodable {
        let id: String
        let streamer_name: String?
    }

    private struct TokenResponse: Decodable {
        let token: String
        let url: String
        let room_name: String?
        let stream_id: String?
    }

    private struct APIError: Decodable {
        let error: String?
    }

    private struct EmptyResponse: Decodable {
        let ok: Bool?
    }

    func signIn() async {
        guard !email.isEmpty, !password.isEmpty else {
            status = "Լրացրու էլ․ փոստը և գաղտնաբառը։"
            return
        }

        isBusy = true
        defer { isBusy = false }

        do {
            _ = try await supabase.auth.signIn(
                email: email.trimmingCharacters(in: .whitespacesAndNewlines),
                password: password
            )
            isSignedIn = true
            status = "Մուտքը հաջողվեց։ Կարող ես սկսել LIVE-ը։"
        } catch {
            status = "Մուտքը չհաջողվեց․ \(error.localizedDescription)"
        }
    }

    func signOut() async {
        do {
            try await supabase.auth.signOut()
        } catch {
            status = "Դուրս գալը չհաջողվեց։"
            return
        }

        isSignedIn = false
        isLive = false
        status = "Դուրս եկար հաշվից։"
    }

    func startLive() async {
        guard isSignedIn else {
            status = "Նախ մուտք գործիր։"
            return
        }

        isBusy = true
        defer { isBusy = false }

        do {
            let session = try await supabase.auth.session

            let created: CreatedLive = try await postFunction(
                "live-create",
                body: [
                    "title": title.isEmpty ? "AIMRELAX PUBG LIVE" : title,
                    "streamer_name": streamerName.isEmpty ? "AIMRELAX" : streamerName,
                    "category": "PUBG"
                ],
                accessToken: session.accessToken
            )

            streamID = created.stream.id

            let credentials: TokenResponse = try await postFunction(
                "live-token",
                body: [
                    "stream_id": created.stream.id,
                    "role": "publisher"
                ],
                accessToken: session.accessToken
            )

let roomOptions = RoomOptions(
    defaultScreenShareCaptureOptions: ScreenShareCaptureOptions(
        appAudio: true
    )
)

let newRoom = Room(roomOptions: roomOptions)
room = newRoom

try await newRoom.connect(
    url: credentials.url,
    token: credentials.token
)

            

            try await newRoom.localParticipant.setMicrophone(enabled: true)
            micEnabled = true

            try await newRoom.localParticipant.setScreenShare(enabled: true)
            isLive = true
            status = "LIVE-ը սկսվում է։ Եթե iPhone-ը ցուցադրի Broadcast պատուհանը, սեղմիր Start Broadcast։"

            try? await setStreamStatus(
                "live",
                streamID: created.stream.id,
                accessToken: session.accessToken
            )
        } catch {
            status = "Չհաջողվեց սկսել LIVE-ը․ \(error.localizedDescription)"
            if let room {
                await room.disconnect()
            }
            room = nil
            isLive = false
        }
    }

    func toggleMic() async {
        guard let room else {
            status = "Նախ սկսիր LIVE-ը։"
            return
        }

        do {
            let next = !micEnabled
            try await room.localParticipant.setMicrophone(enabled: next)
            micEnabled = next
            status = next ? "Խոսափողը միացված է։" : "Խոսափողն անջատված է։"
        } catch {
            status = "Խոսափողի կարգավորումը չհաջողվեց․ \(error.localizedDescription)"
        }
    }

    func stopLive() async {
        isBusy = true
        defer { isBusy = false }

        if let room {
            try? await room.localParticipant.setScreenShare(enabled: false)
            try? await room.localParticipant.setMicrophone(enabled: false)
            await room.disconnect()
        }

        room = nil

        if let streamID, let session = try? await supabase.auth.session {
            _ = try? await postFunction(
                "live-end",
                body: ["stream_id": streamID],
                accessToken: session.accessToken
            ) as EmptyResponse
        }

        streamID = nil
        isLive = false
        status = "LIVE-ն ավարտված է։"
    }

    private func postFunction<T: Decodable>(
        _ name: String,
        body: [String: String],
        accessToken: String
    ) async throws -> T {
        let url = AppConfig.supabaseURL
            .appendingPathComponent("functions")
            .appendingPathComponent("v1")
            .appendingPathComponent(name)

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue(AppConfig.supabaseAnonKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }

        guard (200..<300).contains(http.statusCode) else {
            let message =
                (try? JSONDecoder().decode(APIError.self, from: data).error)
                ?? String(data: data, encoding: .utf8)
                ?? "HTTP \(http.statusCode)"

            throw NSError(
                domain: "AIMRELAX",
                code: http.statusCode,
                userInfo: [NSLocalizedDescriptionKey: message]
            )
        }

        return try JSONDecoder().decode(T.self, from: data)
    }

    private func setStreamStatus(
        _ value: String,
        streamID: String,
        accessToken: String
    ) async throws {
        var components = URLComponents(
            url: AppConfig.supabaseURL.appendingPathComponent("rest/v1/live_streams"),
            resolvingAgainstBaseURL: false
        )!

        components.queryItems = [
            URLQueryItem(name: "id", value: "eq.\(streamID)")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "PATCH"
        request.setValue(AppConfig.supabaseAnonKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("return=minimal", forHTTPHeaderField: "Prefer")
        request.httpBody = try JSONSerialization.data(
            withJSONObject: ["status": value]
        )

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse,
              (200..<300).contains(http.statusCode) else {
            throw NSError(
                domain: "AIMRELAX",
                code: 500,
                userInfo: [
                    NSLocalizedDescriptionKey:
                        "LIVE-ի կարգավիճակը չթարմացվեց։ Ստուգիր Supabase-ի RLS կանոնները։"
                ]
            )
        }
    }
}
