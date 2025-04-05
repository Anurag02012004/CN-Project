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
import { ProtocolComparison } from "./protocol-comparison"
import { MultiHomingDemo } from "./multi-homing-demo"
import { RealWorldApplications } from "./real-world-applications"
import { MultiStreamingDemo } from "./multi-streaming-demo"
import { SctpReliability } from "./sctp-reliability"

export default function SctpPlayground() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [sctpParams, setSctpParams] = useState({
    bandwidth: 10, // Mbps
    latency: 50, // ms
    jitter: 10, // ms
    packetLoss: 2, // %
    multiHomingEnabled: true,
    multiStreamingEnabled: true,
    pathCount: 2, // Number of network paths
    streamCount: 4, // Number of streams
    heartbeatInterval: 30, // seconds
    congestionControl: "standard", // standard, highSpeed, cubic
    orderedDelivery: true,
    reliabilityLevel: 2, // 0-4 (none to full)
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
          <h1 className="text-xl font-bold">SCTP Playground</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Stream Control Transmission Protocol</CardTitle>
                    <CardDescription>Explore SCTP's multi-streaming and multi-homing capabilities</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Ordered Delivery</span>
                            <Switch
                              checked={sctpParams.orderedDelivery}
                              onCheckedChange={(checked) => setSctpParams({ ...sctpParams, orderedDelivery: checked })}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle between ordered and unordered message delivery</p>
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
                <Tabs defaultValue="comparison">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="comparison">Protocol Comparison</TabsTrigger>
                    <TabsTrigger value="multihoming">Multi-Homing</TabsTrigger>
                    <TabsTrigger value="multistreaming">Multi-Streaming</TabsTrigger>
                    <TabsTrigger value="reliability">Reliability</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                  </TabsList>

                  <TabsContent value="comparison" className="mt-4">
                    <ProtocolComparison isActive={isSimulating} sctpParams={sctpParams} />
                  </TabsContent>

                  <TabsContent value="multihoming" className="mt-4">
                    <MultiHomingDemo isActive={isSimulating} sctpParams={sctpParams} />
                  </TabsContent>

                  <TabsContent value="multistreaming" className="mt-4">
                    <MultiStreamingDemo isActive={isSimulating} sctpParams={sctpParams} />
                  </TabsContent>

                  <TabsContent value="reliability" className="mt-4">
                    <SctpReliability isActive={isSimulating} sctpParams={sctpParams} />
                  </TabsContent>

                  <TabsContent value="applications" className="mt-4">
                    <RealWorldApplications isActive={isSimulating} sctpParams={sctpParams} />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-xs text-gray-500 italic">
                SCTP combines the reliability of TCP with the message-oriented nature of UDP, adding multi-streaming and
                multi-homing capabilities
              </CardFooter>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>SCTP Parameters</CardTitle>
                <CardDescription>Adjust these parameters to see their effect on SCTP behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bandwidth: {sctpParams.bandwidth} Mbps</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Available network bandwidth</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[sctpParams.bandwidth]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, bandwidth: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Latency: {sctpParams.latency} ms</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Network delay affecting packet delivery</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[sctpParams.latency]}
                    min={10}
                    max={500}
                    step={5}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, latency: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Packet Loss: {sctpParams.packetLoss}%</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of packets that fail to reach destination</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[sctpParams.packetLoss]}
                    min={0}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, packetLoss: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Path Count: {sctpParams.pathCount}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of network paths for multi-homing</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[sctpParams.pathCount]}
                    min={1}
                    max={4}
                    step={1}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, pathCount: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Stream Count: {sctpParams.streamCount}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of independent streams within a single connection</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[sctpParams.streamCount]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, streamCount: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Heartbeat Interval: {sctpParams.heartbeatInterval}s</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time between heartbeat messages to monitor path health</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[sctpParams.heartbeatInterval]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, heartbeatInterval: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Congestion Control</span>
                  </div>
                  <Select
                    value={sctpParams.congestionControl}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, congestionControl: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select congestion control" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="highSpeed">High Speed</SelectItem>
                      <SelectItem value="cubic">CUBIC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Reliability Level: {sctpParams.reliabilityLevel}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Level of reliability from 0 (none) to 4 (full)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[sctpParams.reliabilityLevel]}
                    min={0}
                    max={4}
                    step={1}
                    onValueChange={(value) => setSctpParams({ ...sctpParams, reliabilityLevel: value[0] })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="multi-homing"
                      checked={sctpParams.multiHomingEnabled}
                      onCheckedChange={(checked) => setSctpParams({ ...sctpParams, multiHomingEnabled: checked })}
                    />
                    <label htmlFor="multi-homing" className="text-sm font-medium">
                      Multi-Homing
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
                        <p>Enable multiple network interfaces per endpoint</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="multi-streaming"
                      checked={sctpParams.multiStreamingEnabled}
                      onCheckedChange={(checked) => setSctpParams({ ...sctpParams, multiStreamingEnabled: checked })}
                    />
                    <label htmlFor="multi-streaming" className="text-sm font-medium">
                      Multi-Streaming
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
                        <p>Enable multiple independent streams within a single connection</p>
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

