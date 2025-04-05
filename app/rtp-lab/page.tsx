"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Pause, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RtpPacketAnalyzer } from "./rtp-packet-analyzer"
import { VoipStreaming } from "./voip-streaming"
import { RtpSecurity } from "./rtp-security"
import { AdaptiveBitrate } from "./adaptive-bitrate"
import { WebRtcSimulation } from "./webrtc-simulation"

export default function RtpLab() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [rtpParams, setRtpParams] = useState({
    bandwidth: 5, // Mbps
    latency: 50, // ms
    jitter: 10, // ms
    packetLoss: 2, // %
    rtcpInterval: 5, // seconds
    securityEnabled: true,
    codecType: "opus", // opus, h264, vp8
    adaptiveBitrate: true,
    fecEnabled: true,
    jitterBuffer: 60, // ms
  })

  const resetSimulation = () => {
    setIsSimulating(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white/80 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">RTP Lab</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Real-time Transport Protocol</CardTitle>
                    <CardDescription>Explore how RTP enables real-time audio and video streaming</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Security</span>
                            <Switch
                              checked={rtpParams.securityEnabled}
                              onCheckedChange={(checked) => setRtpParams({ ...rtpParams, securityEnabled: checked })}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle SRTP (Secure RTP) encryption on/off</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => setIsSimulating(!isSimulating)} className="flex-1">
                    {isSimulating ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="packet">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="packet">Packet Analyzer</TabsTrigger>
                    <TabsTrigger value="voip">VoIP Streaming</TabsTrigger>
                    <TabsTrigger value="security">RTP Security</TabsTrigger>
                    <TabsTrigger value="adaptive">Adaptive Bitrate</TabsTrigger>
                    <TabsTrigger value="webrtc">WebRTC</TabsTrigger>
                  </TabsList>

                  <TabsContent value="packet" className="mt-4">
                    <RtpPacketAnalyzer isActive={isSimulating} rtpParams={rtpParams} />
                  </TabsContent>

                  <TabsContent value="voip" className="mt-4">
                    <VoipStreaming isActive={isSimulating} rtpParams={rtpParams} />
                  </TabsContent>

                  <TabsContent value="security" className="mt-4">
                    <RtpSecurity isActive={isSimulating} rtpParams={rtpParams} />
                  </TabsContent>

                  <TabsContent value="adaptive" className="mt-4">
                    <AdaptiveBitrate isActive={isSimulating} rtpParams={rtpParams} />
                  </TabsContent>

                  <TabsContent value="webrtc" className="mt-4">
                    <WebRtcSimulation isActive={isSimulating} rtpParams={rtpParams} />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-xs text-gray-500 italic">
                RTP is the foundation for real-time media transport over IP networks, enabling VoIP, video conferencing,
                and streaming applications
              </CardFooter>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>RTP Parameters</CardTitle>
                <CardDescription>Adjust these parameters to see their effect on RTP performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Codec Type</span>
                  </div>
                  <Select
                    value={rtpParams.codecType}
                    onValueChange={(value) => setRtpParams({ ...rtpParams, codecType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select codec" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opus">Opus (Audio)</SelectItem>
                      <SelectItem value="h264">H.264 (Video)</SelectItem>
                      <SelectItem value="vp8">VP8 (Video)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bandwidth: {rtpParams.bandwidth} Mbps</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Available network bandwidth for RTP streams</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[rtpParams.bandwidth]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setRtpParams({ ...rtpParams, bandwidth: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Latency: {rtpParams.latency} ms</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Network delay affecting RTP packet delivery</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[rtpParams.latency]}
                    min={10}
                    max={500}
                    step={5}
                    onValueChange={(value) => setRtpParams({ ...rtpParams, latency: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Jitter: {rtpParams.jitter} ms</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Variation in packet delay, critical for real-time media</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[rtpParams.jitter]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setRtpParams({ ...rtpParams, jitter: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Packet Loss: {rtpParams.packetLoss}%</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of RTP packets that fail to reach destination</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[rtpParams.packetLoss]}
                    min={0}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => setRtpParams({ ...rtpParams, packetLoss: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">RTCP Interval: {rtpParams.rtcpInterval}s</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time between RTCP reports for quality monitoring</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[rtpParams.rtcpInterval]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setRtpParams({ ...rtpParams, rtcpInterval: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Jitter Buffer: {rtpParams.jitterBuffer}ms</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Buffer size to compensate for network jitter</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[rtpParams.jitterBuffer]}
                    min={20}
                    max={200}
                    step={10}
                    onValueChange={(value) => setRtpParams({ ...rtpParams, jitterBuffer: value[0] })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="adaptive-bitrate"
                      checked={rtpParams.adaptiveBitrate}
                      onCheckedChange={(checked) => setRtpParams({ ...rtpParams, adaptiveBitrate: checked })}
                    />
                    <label htmlFor="adaptive-bitrate" className="text-sm font-medium">
                      Adaptive Bitrate
                    </label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dynamically adjust bitrate based on network conditions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fec-enabled"
                      checked={rtpParams.fecEnabled}
                      onCheckedChange={(checked) => setRtpParams({ ...rtpParams, fecEnabled: checked })}
                    />
                    <label htmlFor="fec-enabled" className="text-sm font-medium">
                      Forward Error Correction
                    </label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add redundant data to recover from packet loss</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

