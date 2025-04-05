// "use client"

// import { useEffect, useRef } from "react"

// interface MultiHomingDemoProps {
//   isActive: boolean
//   sctpParams: {
//     bandwidth: number
//     latency: number
//     jitter: number
//     packetLoss: number
//     multiHomingEnabled: boolean
//     multiStreamingEnabled: boolean
//     pathCount: number
//     streamCount: number
//     heartbeatInterval: number
//     congestionControl: string
//     orderedDelivery: boolean
//     reliabilityLevel: number
//   }
// }

// export function MultiHomingDemo({ isActive, sctpParams }: MultiHomingDemoProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     if (!canvasRef.current) return

//     const canvas = canvasRef.current
//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Set canvas dimensions
//     const resizeCanvas = () => {
//       const rect = canvas.getBoundingClientRect()
//       canvas.width = rect.width
//       canvas.height = rect.height
//     }

//     resizeCanvas()
//     window.addEventListener("resize", resizeCanvas)

//     // Draw multi-homing demo
//     const drawMultiHomingDemo = () => {
//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       // Background
//       const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
//       gradient.addColorStop(0, "#fdf2f8")
//       gradient.addColorStop(1, "#fbcfe8")
//       ctx.fillStyle = gradient
//       ctx.fillRect(0, 0, canvas.width, canvas.height)

//       // Title
//       ctx.fillStyle = "#1f2937"
//       ctx.font = "bold 18px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText("SCTP Multi-Homing Demonstration", canvas.width / 2, 30)

//       // Draw network topology
//       drawNetworkTopology()

//       // Draw explanation
//       drawExplanation()
//     }

//     const drawNetworkTopology = () => {
//       const centerX = canvas.width / 2
//       const centerY = canvas.height / 2 - 50

//       // Draw hosts
//       const hostRadius = 30
//       const hostSpacing = canvas.width / 2 - 100

//       // Host A (left)
//       drawHost(centerX - hostSpacing, centerY, hostRadius, "Host A", "#10b981")

//       // Host B (right)
//       drawHost(centerX + hostSpacing, centerY, hostRadius, "Host B", "#10b981")

//       // Draw network interfaces
//       const interfaceRadius = 15
//       const interfaceCount = sctpParams.multiHomingEnabled ? sctpParams.pathCount : 1
//       const interfaceAngle = Math.PI / (interfaceCount + 1)

//       // Host A interfaces
//       const hostAInterfaces = []
//       for (let i = 0; i < interfaceCount; i++) {
//         const angle = Math.PI / 2 + interfaceAngle * (i + 1)
//         const x = centerX - hostSpacing + Math.cos(angle) * hostRadius * 1.5
//         const y = centerY + Math.sin(angle) * hostRadius * 1.5

//         drawInterface(x, y, interfaceRadius, `A${i + 1}`, "#3b82f6")
//         hostAInterfaces.push({ x, y })
//       }

//       // Host B interfaces
//       const hostBInterfaces = []
//       for (let i = 0; i < interfaceCount; i++) {
//         const angle = Math.PI / 2 - interfaceAngle * (i + 1)
//         const x = centerX + hostSpacing + Math.cos(angle) * hostRadius * 1.5
//         const y = centerY + Math.sin(angle) * hostRadius * 1.5

//         drawInterface(x, y, interfaceRadius, `B${i + 1}`, "#3b82f6")
//         hostBInterfaces.push({ x, y })
//       }

//       // Draw connections between interfaces
//       for (let i = 0; i < interfaceCount; i++) {
//         const sourceInterface = hostAInterfaces[i]
//         const targetInterface = hostBInterfaces[i]

//         // Connection line
//         ctx.beginPath()
//         ctx.moveTo(sourceInterface.x + interfaceRadius, sourceInterface.y)
//         ctx.lineTo(targetInterface.x - interfaceRadius, targetInterface.y)

//         // Primary path is solid, others are dashed
//         if (i === 0) {
//           ctx.strokeStyle = "#10b981"
//           ctx.lineWidth = 3
//           ctx.setLineDash([])
//         } else {
//           ctx.strokeStyle = i === 1 && isActive && Math.floor(Date.now() / 500) % 2 === 0 ? "#ef4444" : "#6b7280"
//           ctx.lineWidth = 2
//           ctx.setLineDash([5, 5])
//         }

//         ctx.stroke()
//         ctx.setLineDash([])

//         // Path label
//         const pathX = (sourceInterface.x + targetInterface.x) / 2
//         const pathY = (sourceInterface.y + targetInterface.y) / 2 - 10

//         ctx.fillStyle =
//           i === 0 ? "#10b981" : i === 1 && isActive && Math.floor(Date.now() / 500) % 2 === 0 ? "#ef4444" : "#6b7280"
//         ctx.font = "bold 12px sans-serif"
//         ctx.textAlign = "center"
//         ctx.fillText(i === 0 ? "Primary Path" : i === 1 ? "Backup Path" + (isActive && Math.floor(Date.now() / 500) % 2 === 0 ? " (Failing)" : "") : `Backup Path ${i}`, pathX, pathY)
//       }

//       // Draw SCTP association
//       ctx.beginPath()
//       ctx.moveTo(centerX - hostSpacing + hostRadius, centerY)
//       ctx.lineTo(centerX + hostSpacing - hostRadius, centerY)
//       ctx.strokeStyle = "#8b5cf6"
//       ctx.lineWidth = 3
//       ctx.stroke()

//       // Association label
//       ctx.fillStyle = "#8b5cf6"
//       ctx.font = "bold 14px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText("SCTP Association", centerX, centerY - hostRadius - 10)

//       // Draw data packets
//       if (isActive && sctpParams.multiHomingEnabled) {
//         drawDataPackets(hostAInterfaces, hostBInterfaces, interfaceRadius)
//       } else if (isActive) {
//         // Draw single path packets
//         drawSinglePathPackets(hostAInterfaces[0], hostBInterfaces[0], interfaceRadius)
//       }
      
//       // Draw heartbeat packets
//       if (isActive && sctpParams.multiHomingEnabled) {
//         drawHeartbeatPackets(hostAInterfaces, hostBInterfaces, interfaceRadius)
//       }
//     }

//     const drawHost = (x: number, y: number, radius: number, label: string, color: string) => {
//       // Host circle
//       ctx.beginPath()
//       ctx.arc(x, y, radius, 0, Math.PI * 2)
//       ctx.fillStyle = color
//       ctx.fill()
//       ctx.strokeStyle = "#047857"
//       ctx.lineWidth = 2
//       ctx.stroke()

//       // Host label
//       ctx.fillStyle = "#ffffff"
//       ctx.font = "bold 14px sans-serif"
//       ctx.textAlign = "center"
//       ctx.textBaseline = "middle"
//       ctx.fillText(label, x, y)
//     }

//     const drawInterface = (x: number, y: number, radius: number, label: string, color: string) => {
//       // Interface circle
//       ctx.beginPath()
//       ctx.arc(x, y, radius, 0, Math.PI * 2)
//       ctx.fillStyle = color
//       ctx.fill()
//       ctx.strokeStyle = "#1d4ed8"
//       ctx.lineWidth = 1
//       ctx.stroke()

//       // Interface label
//       ctx.fillStyle = "#ffffff"
//       ctx.font = "bold 10px sans-serif"
//       ctx.textAlign = "center"
//       ctx.textBaseline = "middle"
//       ctx.fillText(label, x, y)
//     }

//     const drawDataPackets = (sourceInterfaces: any[], targetInterfaces: any[], interfaceRadius: number) => {
//       const time = Date.now() / 1000
//       const packetCount = 3



"use client"

import { useEffect, useRef } from "react"

interface MultiHomingDemoProps {
  isActive: boolean
  sctpParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    multiHomingEnabled: boolean
    multiStreamingEnabled: boolean
    pathCount: number
    streamCount: number
    heartbeatInterval: number
    congestionControl: string
    orderedDelivery: boolean
    reliabilityLevel: number
  }
}

export function MultiHomingDemo({ isActive, sctpParams }: MultiHomingDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Draw multi-homing demo
    const drawMultiHomingDemo = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#fdf2f8")
      gradient.addColorStop(1, "#fbcfe8")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("SCTP Multi-Homing Demonstration", canvas.width / 2, 30)

      // Draw network topology
      drawNetworkTopology()

      // Draw explanation
      drawExplanation()
    }

    const drawNetworkTopology = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 - 50

      // Draw hosts
      const hostRadius = 30
      const hostSpacing = canvas.width / 2 - 100

      // Host A (left)
      drawHost(centerX - hostSpacing, centerY, hostRadius, "Host A", "#10b981")

      // Host B (right)
      drawHost(centerX + hostSpacing, centerY, hostRadius, "Host B", "#10b981")

      // Draw network interfaces
      const interfaceRadius = 15
      const interfaceCount = sctpParams.multiHomingEnabled ? sctpParams.pathCount : 1
      const interfaceAngle = Math.PI / (interfaceCount + 1)

      // Host A interfaces
      const hostAInterfaces = []
      for (let i = 0; i < interfaceCount; i++) {
        const angle = Math.PI / 2 + interfaceAngle * (i + 1)
        const x = centerX - hostSpacing + Math.cos(angle) * hostRadius * 1.5
        const y = centerY + Math.sin(angle) * hostRadius * 1.5

        drawInterface(x, y, interfaceRadius, `A${i + 1}`, "#3b82f6")
        hostAInterfaces.push({ x, y })
      }

      // Host B interfaces
      const hostBInterfaces = []
      for (let i = 0; i < interfaceCount; i++) {
        const angle = Math.PI / 2 - interfaceAngle * (i + 1)
        const x = centerX + hostSpacing + Math.cos(angle) * hostRadius * 1.5
        const y = centerY + Math.sin(angle) * hostRadius * 1.5

        drawInterface(x, y, interfaceRadius, `B${i + 1}`, "#3b82f6")
        hostBInterfaces.push({ x, y })
      }

      // Draw connections between interfaces
      for (let i = 0; i < interfaceCount; i++) {
        const sourceInterface = hostAInterfaces[i]
        const targetInterface = hostBInterfaces[i]

        // Connection line
        ctx.beginPath()
        ctx.moveTo(sourceInterface.x + interfaceRadius, sourceInterface.y)
        ctx.lineTo(targetInterface.x - interfaceRadius, targetInterface.y)

        // Primary path is solid, others are dashed
        if (i === 0) {
          ctx.strokeStyle = "#10b981"
          ctx.lineWidth = 3
          ctx.setLineDash([])
        } else {
          ctx.strokeStyle = i === 1 && isActive && Math.floor(Date.now() / 500) % 2 === 0 ? "#ef4444" : "#6b7280"
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
        }

        ctx.stroke()
        ctx.setLineDash([])

        // Path label
        const pathX = (sourceInterface.x + targetInterface.x) / 2
        const pathY = (sourceInterface.y + targetInterface.y) / 2 - 10

        ctx.fillStyle =
          i === 0 ? "#10b981" : i === 1 && isActive && Math.floor(Date.now() / 500) % 2 === 0 ? "#ef4444" : "#6b7280"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(i === 0 ? "Primary Path" : i === 1 ? "Backup Path" + (isActive && Math.floor(Date.now() / 500) % 2 === 0 ? " (Failing)" : "") : `Backup Path ${i}`, pathX, pathY)
      }

      // Draw SCTP association
      ctx.beginPath()
      ctx.moveTo(centerX - hostSpacing + hostRadius, centerY)
      ctx.lineTo(centerX + hostSpacing - hostRadius, centerY)
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.stroke()

      // Association label
      ctx.fillStyle = "#8b5cf6"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("SCTP Association", centerX, centerY - hostRadius - 13)

      // Draw data packets
      if (isActive && sctpParams.multiHomingEnabled) {
        drawDataPackets(hostAInterfaces, hostBInterfaces, interfaceRadius)
      } else if (isActive) {
        // Draw single path packets
        drawSinglePathPackets(hostAInterfaces[0], hostBInterfaces[0], interfaceRadius)
      }
      
      // Draw heartbeat packets
      if (isActive && sctpParams.multiHomingEnabled) {
        drawHeartbeatPackets(hostAInterfaces, hostBInterfaces, interfaceRadius)
      }
    }

    const drawHost = (x: number, y: number, radius: number, label: string, color: string) => {
      // Host circle
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#047857"
      ctx.lineWidth = 2
      ctx.stroke()

      // Host label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y)
    }

    const drawInterface = (x: number, y: number, radius: number, label: string, color: string) => {
      // Interface circle
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#1d4ed8"
      ctx.lineWidth = 1
      ctx.stroke()

      // Interface label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y)
    }

    const drawDataPackets = (sourceInterfaces: any[], targetInterfaces: any[], interfaceRadius: number) => {
      const time = Date.now() / 1000
      const packetCount = 3
      
      // Primary path packets
      for (let i = 0; i < packetCount; i++) {
        const progress = (time * 0.5 + i * 0.3) % 1
        const sourceInterface = sourceInterfaces[0]
        const targetInterface = targetInterfaces[0]
        
        // Calculate packet position
        const x = sourceInterface.x + progress * (targetInterface.x - sourceInterface.x)
        const y = sourceInterface.y + progress * (targetInterface.y - sourceInterface.y)
        
        // Draw packet
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = "#10b981"
        ctx.fill()
        ctx.strokeStyle = "#047857"
        ctx.lineWidth = 1
        ctx.stroke()
      }
      
      // If path 1 is failing, show packets on path 2
      if (Math.floor(Date.now() / 1000) % 5 > 2 && sourceInterfaces.length > 2) {
        for (let i = 0; i < packetCount - 1; i++) {
          const progress = (time * 0.5 + i * 0.3) % 1
          const sourceInterface = sourceInterfaces[2]  // Using path 2 when path 1 fails
          const targetInterface = targetInterfaces[2]
          
          // Calculate packet position
          const x = sourceInterface.x + progress * (targetInterface.x - sourceInterface.x)
          const y = sourceInterface.y + progress * (targetInterface.y - sourceInterface.y)
          
          // Draw packet
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, Math.PI * 2)
          ctx.fillStyle = "#8b5cf6"
          ctx.fill()
          ctx.strokeStyle = "#6d28d9"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    const drawSinglePathPackets = (sourceInterface: any, targetInterface: any, interfaceRadius: number) => {
      const time = Date.now() / 1000
      const packetCount = 3
      
      for (let i = 0; i < packetCount; i++) {
        const progress = (time * 0.5 + i * 0.3) % 1
        
        // Calculate packet position
        const x = sourceInterface.x + progress * (targetInterface.x - sourceInterface.x)
        const y = sourceInterface.y + progress * (targetInterface.y - sourceInterface.y)
        
        // Draw packet
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = "#10b981"
        ctx.fill()
        ctx.strokeStyle = "#047857"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    const drawHeartbeatPackets = (sourceInterfaces: any[], targetInterfaces: any[], interfaceRadius: number) => {
      // Draw heartbeats on backup paths only
      for (let i = 1; i < sourceInterfaces.length; i++) {
        const time = Date.now() / 1000
        const heartbeatInterval = sctpParams.heartbeatInterval / 1000 // Convert to seconds
        const progress = (time / heartbeatInterval) % 1
        
        if (progress < 0.5) { // Only draw heartbeat for half the interval
          const sourceInterface = sourceInterfaces[i]
          const targetInterface = targetInterfaces[i]
          
          // Skip drawing heartbeat on failing path
          if (i === 1 && Math.floor(Date.now() / 500) % 2 === 0) continue
          
          // Calculate heartbeat packet position
          const x = progress < 0.25 
            ? sourceInterface.x + (progress * 4) * (targetInterface.x - sourceInterface.x)
            : targetInterface.x - ((progress - 0.25) * 4) * (targetInterface.x - sourceInterface.x)
          const y = progress < 0.25
            ? sourceInterface.y + (progress * 4) * (targetInterface.y - sourceInterface.y)
            : targetInterface.y - ((progress - 0.25) * 4) * (targetInterface.y - sourceInterface.y)
          
          // Draw heartbeat packet (different shape - diamond)
          ctx.beginPath()
          ctx.moveTo(x, y - 6)
          ctx.lineTo(x + 6, y)
          ctx.lineTo(x, y + 6)
          ctx.lineTo(x - 6, y)
          ctx.closePath()
          ctx.fillStyle = "#f59e0b"
          ctx.fill()
          ctx.strokeStyle = "#d97706"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    const drawExplanation = () => {
      const explanationY = canvas.height - 100
      const centerX = canvas.width / 2
      
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      
      if (sctpParams.multiHomingEnabled) {
        ctx.fillText("Multi-Homing: Multiple IP addresses per endpoint for failover", centerX, explanationY)
        ctx.fillText(`Paths: ${sctpParams.pathCount} | Heartbeat Interval: ${sctpParams.heartbeatInterval}ms`, centerX, explanationY + 20)
        
        if (isActive) {
          ctx.fillText("Green packets: Data on primary path | Orange diamonds: Heartbeats", centerX, explanationY + 40)
          ctx.fillText("Failover occurs automatically when primary path fails", centerX, explanationY + 60)
        }
      } else {
        ctx.fillText("Multi-Homing disabled: Single IP address per endpoint", centerX, explanationY)
        ctx.fillText("Connection fails if the single path becomes unavailable", centerX, explanationY + 20)
      }
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      drawMultiHomingDemo()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive, sctpParams])

  return (
    <div className="relative w-full h-full min-h-[400px] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  )
}