import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NetworkIcon, Layers, Activity, GitBranch } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white/80 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold">Network Performance Explorer</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-center">Select a Simulation</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/qos-simulator" className="block">
              <Card className="h-full transition-all hover:shadow-md bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-md bg-blue-500/20 p-2 w-fit">
                    <NetworkIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-700">QoS Simulator</CardTitle>
                  <CardDescription>Visualize Quality of Service metrics and traffic control</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600/80">
                    Explore how QoS affects VoIP, streaming, and gaming with real-time metrics
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/rtp-lab" className="block">
              <Card className="h-full transition-all hover:shadow-md bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-md bg-purple-500/20 p-2 w-fit">
                    <Layers className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-purple-700">RTP Lab</CardTitle>
                  <CardDescription>Analyze Real-Time Transport Protocol behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-600/80">
                    Interactive packet analysis and streaming emulation with RTP/RTCP
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/sctp-playground" className="block">
              <Card className="h-full transition-all hover:shadow-md bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-md bg-green-500/20 p-2 w-fit">
                    <GitBranch className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-700">SCTP Playground</CardTitle>
                  <CardDescription>Compare SCTP with TCP and UDP protocols</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600/80">
                    Visualize multi-streaming, multi-homing, and reliability differences
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/congestion-control" className="block">
              <Card className="h-full transition-all hover:shadow-md bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-md bg-orange-500/20 p-2 w-fit">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-orange-700">Congestion Control</CardTitle>
                  <CardDescription>Explore next-gen congestion control algorithms</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-600/80">
                    Compare TCP variants and see how AI-powered solutions adapt to network conditions
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

