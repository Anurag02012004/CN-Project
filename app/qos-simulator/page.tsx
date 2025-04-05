"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Pause, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NetworkSimulation } from "./network-simulation"
import { ApplicationImpact } from "./application-impact"
import { TrafficControl } from "./traffic-control"
import { QoSMetricsDashboard } from "./qos-metrics-dashboard"
import { QoSMechanisms } from "./qos-mechanisms"
import { NetworkComparison } from "./network-comparison"

export default function QoSSimulator() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [networkParams, setNetworkParams] = useState({
    bandwidth: 10, // Mbps
    latency: 50, // ms
    jitter: 10, // ms
    packetLoss: 2, // %
    priorityQueue: true,
    networkType: "wifi", // wifi, lte, 5g
    qosEnabled: true,
    trafficShaping: "token", // token, leaky, none
    congestionAvoidance: "red", // red, ecn, codel, none
    bufferSize: 50, // %
  })

  const [metrics, setMetrics] = useState({
    latency: [],
    jitter: [],
    bandwidth: [],
    packetLoss: [],
  })

  // Update metrics based on network parameters when simulation is active
  useState(() => {
    let interval: NodeJS.Timeout

    if (isSimulating) {
      interval = setInterval(() => {
        setMetrics((prev) => {
          // Apply network type modifiers
          let latencyModifier = 1
          let bandwidthModifier = 1
          let jitterModifier = 1
          let packetLossModifier = 1

          switch (networkParams.networkType) {
            case "5g":
              latencyModifier = 0.4
              bandwidthModifier = 3
              jitterModifier = 0.3
              packetLossModifier = 0.3
              break
            case "lte":
              latencyModifier = 0.8
              bandwidthModifier = 1.5
              jitterModifier = 0.7
              packetLossModifier = 0.7
              break
            case "wifi":
              latencyModifier = 1
              bandwidthModifier = 1
              jitterModifier = 1
              packetLossModifier = 1
              break
          }

          // Apply QoS modifiers
          if (networkParams.qosEnabled) {
            latencyModifier *= 0.7
            jitterModifier *= 0.5
            packetLossModifier *= 0.6
          }

          // Apply traffic shaping modifiers
          if (networkParams.trafficShaping !== "none") {
            bandwidthModifier *= 0.9
            jitterModifier *= 0.7
          }

          // Apply congestion avoidance modifiers
          if (networkParams.congestionAvoidance !== "none") {
            packetLossModifier *= 0.8
            latencyModifier *= 0.9
          }

          // Calculate new metrics with modifiers
          const newLatency = [...prev.latency, networkParams.latency * latencyModifier + (Math.random() * 20 - 10)]
          const newJitter = [...prev.jitter, networkParams.jitter * jitterModifier + (Math.random() * 5 - 2.5)]
          const newBandwidth = [
            ...prev.bandwidth,
            networkParams.bandwidth * bandwidthModifier * (0.8 + Math.random() * 0.4),
          ]
          const newPacketLoss = [
            ...prev.packetLoss,
            networkParams.packetLoss * packetLossModifier * (0.5 + Math.random()),
          ]

          // Keep only the last 20 data points
          return {
            latency: newLatency.slice(-20),
            jitter: newJitter.slice(-20),
            bandwidth: newBandwidth.slice(-20),
            packetLoss: newPacketLoss.slice(-20),
          }
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isSimulating, networkParams])

  const resetSimulation = () => {
    setIsSimulating(false)
    setMetrics({
      latency: [],
      jitter: [],
      bandwidth: [],
      packetLoss: [],
    })
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
          <h1 className="text-xl font-bold">QoS Simulator</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Network Visualization</CardTitle>
                    <CardDescription>Visual representation of network traffic with QoS applied</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">QoS Enabled</span>
                            <Switch
                              checked={networkParams.qosEnabled}
                              onCheckedChange={(checked) => setNetworkParams({ ...networkParams, qosEnabled: checked })}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle Quality of Service mechanisms on/off to see the difference</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] relative">
                <NetworkSimulation isActive={isSimulating} networkParams={networkParams} />
              </CardContent>
              <CardFooter className="text-xs text-gray-500 italic">
                Observe how different traffic types (VoIP, Video, Data) are affected by network conditions and QoS
                settings
              </CardFooter>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Network Parameters</CardTitle>
                <CardDescription>Adjust these parameters to see their effect on QoS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Network Type</span>
                  </div>
                  <Select
                    value={networkParams.networkType}
                    onValueChange={(value) => setNetworkParams({ ...networkParams, networkType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select network type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wifi">Wi-Fi</SelectItem>
                      <SelectItem value="lte">4G LTE</SelectItem>
                      <SelectItem value="5g">5G</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bandwidth: {networkParams.bandwidth} Mbps</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maximum data transfer rate of the network</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[networkParams.bandwidth]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setNetworkParams({ ...networkParams, bandwidth: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Latency: {networkParams.latency} ms</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time it takes for data to travel from source to destination</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[networkParams.latency]}
                    min={10}
                    max={500}
                    step={5}
                    onValueChange={(value) => setNetworkParams({ ...networkParams, latency: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Jitter: {networkParams.jitter} ms</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Variation in packet delay, critical for real-time applications</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[networkParams.jitter]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setNetworkParams({ ...networkParams, jitter: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Packet Loss: {networkParams.packetLoss}%</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of packets that fail to reach their destination</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[networkParams.packetLoss]}
                    min={0}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => setNetworkParams({ ...networkParams, packetLoss: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Traffic Shaping</span>
                  </div>
                  <Select
                    value={networkParams.trafficShaping}
                    onValueChange={(value) => setNetworkParams({ ...networkParams, trafficShaping: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select traffic shaping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="token">Token Bucket</SelectItem>
                      <SelectItem value="leaky">Leaky Bucket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Congestion Avoidance</span>
                  </div>
                  <Select
                    value={networkParams.congestionAvoidance}
                    onValueChange={(value) => setNetworkParams({ ...networkParams, congestionAvoidance: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select congestion avoidance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="red">RED</SelectItem>
                      <SelectItem value="ecn">ECN</SelectItem>
                      <SelectItem value="codel">CoDel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
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
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="metrics">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="metrics">QoS Metrics</TabsTrigger>
              <TabsTrigger value="applications">Application Impact</TabsTrigger>
              <TabsTrigger value="traffic">Traffic Control</TabsTrigger>
              <TabsTrigger value="mechanisms">QoS Mechanisms</TabsTrigger>
              <TabsTrigger value="comparison">Network Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="mt-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>QoS Metrics Dashboard</CardTitle>
                  <CardDescription>Real-time visualization of key QoS metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <QoSMetricsDashboard isActive={isSimulating} metrics={metrics} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="mt-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Application Impact</CardTitle>
                  <CardDescription>See how QoS affects different applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationImpact isActive={isSimulating} networkParams={networkParams} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traffic" className="mt-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Traffic Control</CardTitle>
                  <CardDescription>Visualize how traffic shaping and prioritization works</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrafficControl isActive={isSimulating} networkParams={networkParams} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mechanisms" className="mt-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>QoS Mechanisms</CardTitle>
                  <CardDescription>Explore different QoS mechanisms and their effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <QoSMechanisms isActive={isSimulating} networkParams={networkParams} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="mt-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Network Technology Comparison</CardTitle>
                  <CardDescription>Compare QoS in 5G, LTE, and Wi-Fi networks</CardDescription>
                </CardHeader>
                <CardContent>
                  <NetworkComparison isActive={isSimulating} networkParams={networkParams} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

