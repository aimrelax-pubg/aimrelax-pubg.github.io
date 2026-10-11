
import LiveKit

#if os(iOS)
@available(iOS 12.0, *)
class SampleHandler: LKSampleHandler {
    override var enableLogging: Bool { true }
}
#endif
