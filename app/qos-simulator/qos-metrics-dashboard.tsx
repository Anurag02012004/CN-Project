// "use client"

// import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
// import { Card, CardContent } from "@/components/ui/card"

// interface QosMetricsDashboardProps {
//   isActive: boolean
//   metrics: {
//     latency: number[]
//     jitter: number[]
//     bandwidth: number[]
//     packetLoss: number[]
//   }
// }

// export function QoSMetricsDashboard({ isActive, metrics }: QosMetricsDashboardProps) {
//   // Convert metrics arrays to chart data format
//   const chartData = metrics.latency.map((_, index) => ({
//     name: index,
//     latency: metrics.latency[index] || 0,
//     jitter: metrics.jitter[index] || 0,
//     bandwidth: metrics.bandwidth[index] || 0,
//     packetLoss: metrics.packetLoss[index] || 0,
//   }))

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       <Card>
//         <CardContent className="p-4">
//           <h3 className="mb-2 text-sm font-medium">Latency (ms)</h3>
//           <div className="h-[200px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis domain={["auto", "auto"]} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="latency"
//                   name="Latency"
//                   stroke="#3b82f6"
//                   strokeWidth={2}
//                   dot={false}
//                   isAnimationActive={isActive}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent className="p-4">
//           <h3 className="mb-2 text-sm font-medium">Jitter (ms)</h3>
//           <div className="h-[200px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis domain={["auto", "auto"]} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="jitter"
//                   name="Jitter"
//                   stroke="#8b5cf6"
//                   strokeWidth={2}
//                   dot={false}
//                   isAnimationActive={isActive}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent className="p-4">
//           <h3 className="mb-2 text-sm font-medium">Bandwidth (Mbps)</h3>
//           <div className="h-[200px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis domain={["auto", "auto"]} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="bandwidth"
//                   name="Bandwidth"
//                   stroke="#10b981"
//                   strokeWidth={2}
//                   dot={false}
//                   isAnimationActive={isActive}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent className="p-4">
//           <h3 className="mb-2 text-sm font-medium">Packet Loss (%)</h3>
//           <div className="h-[200px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis domain={["auto", "auto"]} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="packetLoss"
//                   name="Packet Loss"
//                   stroke="#ef4444"
//                   strokeWidth={2}
//                   dot={false}
//                   isAnimationActive={isActive}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



 "use client"

import { useEffect, useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface QosMetricsDashboardProps {
  isActive: boolean
}

export function QoSMetricsDashboard({ isActive }: QosMetricsDashboardProps) {
  // Simulated state for dynamic metrics
  const [metrics, setMetrics] = useState({
    latency: [] as number[],
    jitter: [] as number[],
    bandwidth: [] as number[],
    packetLoss: [] as number[],
  })

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setMetrics((prevMetrics) => {
        const newLatency = (Math.random() * 50 + 50).toFixed(2) // Simulating latency (50ms - 100ms)
        const newJitter = (Math.random() * 10).toFixed(2) // Simulating jitter (0ms - 10ms)
        const newBandwidth = (Math.random() * 100 + 500).toFixed(2) // Simulating bandwidth (500Mbps - 600Mbps)
        const newPacketLoss = (Math.random() * 5).toFixed(2) // Simulating packet loss (0% - 5%)

        return {
          latency: [...prevMetrics.latency.slice(-19), parseFloat(newLatency)],
          jitter: [...prevMetrics.jitter.slice(-19), parseFloat(newJitter)],
          bandwidth: [...prevMetrics.bandwidth.slice(-19), parseFloat(newBandwidth)],
          packetLoss: [...prevMetrics.packetLoss.slice(-19), parseFloat(newPacketLoss)],
        }
      })
    }, 1000) // Updates every second

    return () => clearInterval(interval)
  }, [isActive])

  // Convert metrics arrays to chart data format
  const chartData = metrics.latency.map((_, index) => ({
    name: index,
    latency: metrics.latency[index] || 0,
    jitter: metrics.jitter[index] || 0,
    bandwidth: metrics.bandwidth[index] || 0,
    packetLoss: metrics.packetLoss[index] || 0,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <QoSChart title="Latency (ms)" dataKey="latency" color="#3b82f6" data={chartData} />
      <QoSChart title="Jitter (ms)" dataKey="jitter" color="#8b5cf6" data={chartData} />
      <QoSChart title="Bandwidth (Mbps)" dataKey="bandwidth" color="#10b981" data={chartData} />
      <QoSChart title="Packet Loss (%)" dataKey="packetLoss" color="#ef4444" data={chartData} />
    </div>
  )
}

// Reusable Chart Component
const QoSChart = ({ title, dataKey, color, data }: { title: string; dataKey: string; color: string; data: any[] }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
)



