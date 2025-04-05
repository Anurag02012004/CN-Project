"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Pause, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NetworkCongestionMap } from "./network-congestion-map"
import { AiPoweredControl } from "./ai-powered-control"
import { SdnIntegration } from "./sdn-integration"

export default function CongestionControl() {
  const [isSimulating, setIsSimulating] = useState(false)

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
          <h1 className="text-xl font-bold">Congestion Control Arena</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Next-Gen Congestion Control</CardTitle>
              <CardDescription>
                Explore how different congestion control algorithms adapt to network conditions
              </CardDescription>
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
              <Tabs defaultValue="map">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="map">Network Congestion Map</TabsTrigger>
                  <TabsTrigger value="ai">AI-Powered Control</TabsTrigger>
                  <TabsTrigger value="sdn">5G & SDN Integration</TabsTrigger>
                </TabsList>

                <TabsContent value="map" className="mt-4">
                  <NetworkCongestionMap isActive={isSimulating} />
                </TabsContent>

                <TabsContent value="ai" className="mt-4">
                  <AiPoweredControl isActive={isSimulating} />
                </TabsContent>

                <TabsContent value="sdn" className="mt-4">
                  <SdnIntegration isActive={isSimulating} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

