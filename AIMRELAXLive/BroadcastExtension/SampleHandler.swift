
import ReplayKit
import CoreMedia

final class SampleHandler: RPBroadcastSampleHandler {
    override func broadcastStarted(withSetupInfo setupInfo: [String : NSObject]?) {
        NSLog("AIMRELAX LIVE: Broadcast started")
    }

    override func broadcastPaused() {
        NSLog("AIMRELAX LIVE: Broadcast paused")
    }

    override func broadcastResumed() {
        NSLog("AIMRELAX LIVE: Broadcast resumed")
    }

    override func broadcastFinished() {
        NSLog("AIMRELAX LIVE: Broadcast finished")
    }

    override func processSampleBuffer(
        _ sampleBuffer: CMSampleBuffer,
        with sampleBufferType: RPSampleBufferType
    ) {
        switch sampleBufferType {
        case .video:
            // Էկրանի կադրերը մշակելու տեղը։
            break
        case .audioApp:
            // Խաղի ձայնի մշակման տեղը։
            break
        case .audioMic:
            // Խոսափողի ձայնի մշակման տեղը։
            break
        @unknown default:
            break
        }
    }
}
