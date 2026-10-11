
import SwiftUI

@main
struct AIMRELAXLiveApp: App {
    @StateObject private var live = LiveController()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(live)
                .preferredColorScheme(.dark)
        }
    }
}

struct ContentView: View {
    @EnvironmentObject private var live: LiveController

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    Image(systemName: "dot.radiowaves.left.and.right")
                        .font(.system(size: 54))
                        .foregroundStyle(.red)

                    Text("AIMRELAX PUBG")
                        .font(.largeTitle.bold())

                    Text("LIVE STREAM")
                        .font(.title3.weight(.semibold))
                        .foregroundStyle(.red)

                    Group {
                        TextField("Էլ․ փոստ", text: $live.email)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                            .textContentType(.emailAddress)

                        SecureField("Գաղտնաբառ", text: $live.password)
                            .textContentType(.password)
                    }
                    .textFieldStyle(.roundedBorder)

                    Button {
                        Task { await live.signIn() }
                    } label: {
                        Label("Մուտք գործել", systemImage: "person.fill")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(live.isBusy || live.isSignedIn)

                    if live.isSignedIn {
                        TextField("Հեռարձակողի անունը", text: $live.streamerName)
                            .textFieldStyle(.roundedBorder)

                        TextField("Հեռարձակման վերնագիրը", text: $live.title)
                            .textFieldStyle(.roundedBorder)

                        Button {
                            Task { await live.startLive() }
                        } label: {
                            Label("ՍԿՍԵԼ LIVE", systemImage: "dot.radiowaves.left.and.right")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.red)
                        .disabled(live.isBusy || live.isLive)

                        if live.isLive {
                            Button {
                                Task { await live.toggleMic() }
                            } label: {
                                Label(
                                    live.micEnabled ? "Անջատել խոսափողը" : "Միացնել խոսափողը",
                                    systemImage: live.micEnabled ? "mic.fill" : "mic.slash.fill"
                                )
                                .frame(maxWidth: .infinity)
                            }
                            .buttonStyle(.bordered)

                            Button(role: .destructive) {
                                Task { await live.stopLive() }
                            } label: {
                                Label("ԱՎԱՐՏԵԼ LIVE-ը", systemImage: "stop.fill")
                                    .frame(maxWidth: .infinity)
                            }
                            .buttonStyle(.borderedProminent)
                            .disabled(live.isBusy)
                        }

                        Button("Դուրս գալ հաշվից", role: .destructive) {
                            Task { await live.signOut() }
                        }
                        .disabled(live.isBusy || live.isLive)
                    }

                    if live.isBusy {
                        ProgressView("Խնդրում եմ սպասել…")
                    }

                    Text(live.status)
                        .font(.callout)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                        .background(.white.opacity(0.08))
                        .clipShape(RoundedRectangle(cornerRadius: 12))

                    Text("Հեռարձակման համար անհրաժեշտ են ճիշտ Supabase կարգավորումներ և iOS Broadcast Extension։")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding()
            }
            .background(Color.black)
        }
    }
}
