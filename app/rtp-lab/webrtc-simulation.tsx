"use client"

import { useEffect, useRef } from "react"

interface WebRtcSimulationProps {
  isActive: boolean
  rtpParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    rtcpInterval: number
    securityEnabled: boolean
    codecType: string
    adaptiveBitrate: boolean
    fecEnabled: boolean
    jitterBuffer: number
  }
}

export function WebRtcSimulation({ isActive, rtpParams }: WebRtcSimulationProps) {
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

    // Draw WebRTC simulation
    const drawWebRtcSimulation = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#fdf2f8")
      gradient.addColorStop(1, "#fbcfe8")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("WebRTC Communication", canvas.width / 2, 30)

      // Draw WebRTC architecture
      drawWebRtcArchitecture()

      // Draw peer connection
      drawPeerConnection()

      // Draw media flow
      if (isActive) {
        drawMediaFlow()
      }
    }

    const drawWebRtcArchitecture = () => {
      const startY = 60
      const width = canvas.width - 100
      const height = 140
      const x = canvas.width / 2

      // Architecture title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("WebRTC Architecture", x, startY - 10)

      // Draw layers
      const layerHeight = 30
      const layerSpacing = 5
      const layerColors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"]
      const layerLabels = ["Web Application", "WebRTC API", "RTP/RTCP", "Transport Layer (UDP/TCP)"]

      for (let i = 0; i < layerLabels.length; i++) {
        const layerY = startY + i * (layerHeight + layerSpacing)

        // Layer background
        ctx.fillStyle = `${layerColors[i]}22`
        ctx.fillRect(x - width / 2, layerY, width, layerHeight)
        ctx.strokeStyle = layerColors[i]
        ctx.lineWidth = 1
        ctx.strokeRect(x - width / 2, layerY, width, layerHeight)

        // Layer label
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(layerLabels[i], x, layerY + layerHeight / 2)
      }

      // Draw WebRTC components
      const componentY = startY + height + 20
      const componentWidth = width / 3 - 20
      const componentHeight = 40
      const componentSpacing = 30

      const components = [
        { name: "MediaStream", color: "#3b82f6", description: "Captures audio/video" },
        { name: "RTCPeerConnection", color: "#8b5cf6", description: "Manages connections" },
        { name: "RTCDataChannel", color: "#10b981", description: "Sends arbitrary data" },
      ]

      for (let i = 0; i < components.length; i++) {
        const component = components[i]
        const componentX = x - width / 2 + i * (componentWidth + componentSpacing) + componentWidth / 2

        // Component background
        ctx.fillStyle = component.color
        ctx.beginPath()
        ctx.roundRect(componentX - componentWidth / 2, componentY, componentWidth, componentHeight, 5)
        ctx.fill()

        // Component label
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(component.name, componentX, componentY + componentHeight / 2)

        // Component description
        ctx.fillStyle = "#1f2937"
        ctx.font = "11px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(component.description, componentX, componentY + componentHeight + 15)
      }
    }

    const drawPeerConnection = () => {
      const startY = 250
      const width = canvas.width - 100
      const height = 200
      const x = canvas.width / 2

      // Section title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Peer-to-Peer Connection", x, startY )

      // Draw browsers
      const browserWidth = 120
      const browserHeight = 80
      const browserSpacing = width - browserWidth * 2

      // Browser 1 (left)
      drawBrowser(x - width / 2 + browserWidth / 2, startY + height / 2, browserWidth, browserHeight, "Browser 1")

      // Browser 2 (right)
      drawBrowser(x + width / 2 - browserWidth / 2, startY + height / 2, browserWidth, browserHeight, "Browser 2")

      // Draw STUN/TURN server
      const serverY = startY + 30
      drawServer(x, serverY, "STUN/TURN")

      // Draw connections
      ctx.beginPath()
      ctx.moveTo(x - width / 2 + browserWidth, startY + height / 2)
      ctx.lineTo(x + width / 2 - browserWidth, startY + height / 2)
      ctx.strokeStyle = rtpParams.securityEnabled ? "#10b981" : "#6b7280"
      ctx.lineWidth = 2
      ctx.stroke()

      // Connection label
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        rtpParams.securityEnabled ? "Encrypted P2P Connection" : "P2P Connection",
        x,
        startY + height / 2 + 15,
      )

      // Draw NAT traversal connections
      ctx.beginPath()
      ctx.moveTo(x - width / 2 + browserWidth / 2, startY + height / 2 - browserHeight / 4)
      ctx.lineTo(x, serverY + 20)
      ctx.moveTo(x + width / 2 - browserWidth / 2, startY + height / 2 - browserHeight / 4)
      ctx.lineTo(x, serverY + 20)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // NAT traversal label
      ctx.fillStyle = "#6b7280"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("NAT Traversal", x, serverY + 40)

      // Draw signaling server
      const signalingY = startY + height - 30
      drawServer(x, signalingY, "Signaling Server")

      // Draw signaling connections
      ctx.beginPath()
      ctx.moveTo(x - width / 2 + browserWidth / 2, startY + height / 2 + browserHeight / 4)
      ctx.lineTo(x, signalingY - 20)
      ctx.moveTo(x + width / 2 - browserWidth / 2, startY + height / 2 + browserHeight / 4)
      ctx.lineTo(x, signalingY - 20)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // Signaling label
      ctx.fillStyle = "#6b7280"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Signaling (SDP Exchange)", x, signalingY - 30)
    }

    const drawBrowser = (x: number, y: number, width: number, height: number, label: string) => {
      // Browser window
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.roundRect(x - width / 2, y - height / 2, width, height, 5)
      ctx.fill()
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.stroke()

      // Browser header
      ctx.fillStyle = "#f3f4f6"
      ctx.beginPath()
      ctx.roundRect(x - width / 2, y - height / 2, width, 20, [5, 5, 0, 0])
      ctx.fill()
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x - width / 2, y - height / 2 + 20)
      ctx.lineTo(x + width / 2, y - height / 2 + 20)
      ctx.stroke()

      // Browser controls
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(x - width / 2 + 10, y - height / 2 + 10, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.arc(x - width / 2 + 20, y - height / 2 + 10, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#10b981"
      ctx.beginPath()
      ctx.arc(x - width / 2 + 30, y - height / 2 + 10, 3, 0, Math.PI * 2)
      ctx.fill()

      // Browser label
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y)

      // WebRTC icon
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y + 20, 10, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("RTC", x, y + 20)
    }

    const drawServer = (x: number, y: number, label: string) => {
      // Server icon
      ctx.fillStyle = "#8b5cf6"
      ctx.beginPath()
      ctx.roundRect(x - 40, y - 15, 80, 30, 5)
      ctx.fill()

      // Server label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y)
    }

    const drawMediaFlow = () => {
      const time = Date.now() / 1000
      const startY = 250
      const width = canvas.width - 100
      const height = 200
      const x = canvas.width / 2

      const browserWidth = 120
      const browserSpacing = width - browserWidth * 2

      // Browser positions
      const browser1X = x - width / 2 + browserWidth / 2
      const browser2X = x + width / 2 - browserWidth / 2
      const browserY = startY + height / 2

      // Draw media packets flowing between browsers
      const packetCount = 5

      for (let i = 0; i < packetCount; i++) {
        // Calculate packet position
        const offset = (time + i / packetCount) % 1
        const packetX = browser1X + (browser2X - browser1X) * offset

        // Simulate jitter
        const jitterEffect = (Math.sin(time * 10 + i) * rtpParams.jitter) / 20
        const packetY = browserY + jitterEffect

        // Skip some packets if packet loss is enabled
        if (Math.random() * 100 < rtpParams.packetLoss) {
          continue
        }

        // Draw packet
        ctx.beginPath()
        ctx.arc(packetX, packetY, 5, 0, Math.PI * 2)

        // Color based on media type
        let packetColor
        let packetLabel

        if (i % 3 === 0) {
          packetColor = "#ef4444" // Video
          packetLabel = "V"
        } else if (i % 3 === 1) {
          packetColor = "#3b82f6" // Audio
          packetLabel = "A"
        } else {
          packetColor = "#10b981" // Data
          packetLabel = "D"
        }

        ctx.fillStyle = packetColor
        ctx.fill()

        if (rtpParams.securityEnabled) {
          // Draw lock icon for secure packets
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 6px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("🔒", packetX, packetY)
        } else {
          // Draw media type label
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(packetLabel, packetX, packetY)
        }
      }

      // Draw RTCP packets (feedback) flowing in reverse
      if (Math.floor(time) % rtpParams.rtcpInterval === 0) {
        const rtcpX = browser2X - (browser2X - browser1X) * ((time * 2) % 1)
        const rtcpY = browserY + 10

        // RTCP packet
        ctx.beginPath()
        ctx.rect(rtcpX - 8, rtcpY - 5, 16, 10)
        ctx.fillStyle = "#8b5cf6"
        ctx.fill()

        // RTCP label
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 7px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("RTCP", rtcpX, rtcpY)
      }

      // Draw video preview in browsers
      drawVideoPreview(browser1X, browserY - 15, 40, 30, time)
      drawVideoPreview(browser2X, browserY - 15, 40, 30, time + 0.1) // Slight delay
    }

    const drawVideoPreview = (x: number, y: number, width: number, height: number, time: number) => {
      // Video background
      ctx.fillStyle = "#000000"
      ctx.fillRect(x - width / 2, y - height / 2, width, height)

      // Simple animation for video content
      const hue = (time * 20) % 360

      // Draw a simple shape that moves
      const shapeX = x - width / 4 + (Math.sin(time * 2) * width) / 8
      const shapeY = y + (Math.cos(time * 2) * height) / 8

      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      ctx.beginPath()
      ctx.arc(shapeX, shapeY, 5, 0, Math.PI * 2)
      ctx.fill()

      // Camera icon
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "top"
      ctx.fillText("📹", x + width / 2 - 2, y - height / 2 + 2)
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawWebRtcSimulation()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawWebRtcSimulation()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, rtpParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}


// "use client"

// import { useEffect, useRef } from "react"

// interface WebRtcSimulationProps {
//   isActive: boolean
//   rtpParams: {
//     bandwidth: number
//     latency: number
//     jitter: number
//     packetLoss: number
//     rtcpInterval: number
//     securityEnabled: boolean
//     codecType: string
//     adaptiveBitrate: boolean
//     fecEnabled: boolean
//     jitterBuffer: number
//   }
// }

// export function WebRtcSimulation({ isActive, rtpParams }: WebRtcSimulationProps) {
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

//     // Draw WebRTC simulation
//     const drawWebRtcSimulation = () => {
//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       // Background
//       const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
//       gradient.addColorStop(0, "#fdf2f8")
//       gradient.addColorStop(1, "#fbcfe8")
//       ctx.fillStyle = gradient
//       ctx.fillRect(0, 0, canvas.width, canvas.height)

//       // Draw title
//       ctx.fillStyle = "#1f2937"
//       ctx.font = "bold 18px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText("WebRTC Communication", canvas.width / 2, 30)

//       // Draw WebRTC architecture
//       drawWebRtcArchitecture()

//       // Draw peer connection
//       drawPeerConnection()

//       // Draw media flow
//       if (isActive) {
//         drawMediaFlow()
//       }
//     }

//     const drawWebRtcArchitecture = () => {
//       const startY = 60
//       const width = canvas.width - 100
//       const height = 140
//       const x = canvas.width / 2

//       // Architecture title
//       ctx.fillStyle = "#1f2937"
//       ctx.font = "bold 14px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText("WebRTC Architecture", x, startY - 10)

//       // Draw layers
//       const layerHeight = 30
//       const layerSpacing = 5
//       const layerColors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"]
//       const layerLabels = ["Web Application", "WebRTC API", "RTP/RTCP", "Transport Layer (UDP/TCP)"]

//       for (let i = 0; i < layerLabels.length; i++) {
//         const layerY = startY + i * (layerHeight + layerSpacing)

//         // Layer background
//         ctx.fillStyle = `${layerColors[i]}22`
//         ctx.fillRect(x - width / 2, layerY, width, layerHeight)
//         ctx.strokeStyle = layerColors[i]
//         ctx.lineWidth = 1
//         ctx.strokeRect(x - width / 2, layerY, width, layerHeight)

//         // Layer label
//         ctx.fillStyle = "#1f2937"
//         ctx.font = "bold 12px sans-serif"
//         ctx.textAlign = "center"
//         ctx.textBaseline = "middle"
//         ctx.fillText(layerLabels[i], x, layerY + layerHeight / 2)
//       }

//       // Draw WebRTC components
//       const componentY = startY + height + 20
//       const componentWidth = width / 3 - 20
//       const componentHeight = 40
//       const componentSpacing = 30

//       const components = [
//         { name: "MediaStream", color: "#3b82f6", description: "Captures audio/video" },
//         { name: "RTCPeerConnection", color: "#8b5cf6", description: "Manages connections" },
//         { name: "RTCDataChannel", color: "#10b981", description: "Sends arbitrary data" },
//       ]

//       for (let i = 0; i < components.length; i++) {
//         const component = components[i]
//         const componentX = x - width / 2 + i * (componentWidth + componentSpacing) + componentWidth / 2

//         // Component background
//         ctx.fillStyle = component.color
//         ctx.beginPath()
//         ctx.roundRect(componentX - componentWidth / 2, componentY, componentWidth, componentHeight, 5)
//         ctx.fill()

//         // Component label
//         ctx.fillStyle = "#ffffff"
//         ctx.font = "bold 12px sans-serif"
//         ctx.textAlign = "center"
//         ctx.textBaseline = "middle"
//         ctx.fillText(component.name, componentX, componentY + componentHeight / 2)

//         // Component description
//         ctx.fillStyle = "#1f2937"
//         ctx.font = "11px sans-serif"
//         ctx.textAlign = "center"
//         ctx.fillText(component.description, componentX, componentY + componentHeight + 15)
//       }
//     }

//     const drawPeerConnection = () => {
//       const startY = 250
//       const width = canvas.width - 100
//       const height = 200
//       const x = canvas.width / 2

//       // Section title
//       ctx.fillStyle = "#1f2937"
//       ctx.font = "bold 14px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText("Peer-to-Peer Connection", x, startY - 10)

//       // Draw browsers
//       const browserWidth = 120
//       const browserHeight = 80
//       const browserSpacing = width - browserWidth * 2

//       // Browser 1 (left)
//       drawBrowser(x - width / 2 + browserWidth / 2, startY + height / 2, browserWidth, browserHeight, "Browser 1")

//       // Browser 2 (right)
//       drawBrowser(x + width / 2 - browserWidth / 2, startY + height / 2, browserWidth, browserHeight, "Browser 2")

//       // Draw STUN/TURN server
//       const serverY = startY + 30
//       drawServer(x, serverY, "STUN/TURN Server")

//       // Draw connections
//       ctx.beginPath()
//       ctx.moveTo(x - width / 2 + browserWidth, startY + height / 2)
//       ctx.lineTo(x + width / 2 - browserWidth, startY + height / 2)
//       ctx.strokeStyle = rtpParams.securityEnabled ? "#10b981" : "#6b7280"
//       ctx.lineWidth = 2
//       ctx.stroke()

//       // Connection label
//       ctx.fillStyle = "#1f2937"
//       ctx.font = "12px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText(
//         rtpParams.securityEnabled ? "Encrypted P2P Connection" : "P2P Connection",
//         x,
//         startY + height / 2 + 15,
//       )

//       // Draw NAT traversal connections
//       ctx.beginPath()
//       ctx.moveTo(x - width / 2 + browserWidth / 2, startY + height / 2 - browserHeight / 4)
//       ctx.lineTo(x, serverY + 20)
//       ctx.moveTo(x + width / 2 - browserWidth / 2, startY + height / 2 - browserHeight / 4)
//       ctx.lineTo(x, serverY + 20)
//       ctx.strokeStyle = "#6b7280"
//       ctx.lineWidth = 1
//       ctx.setLineDash([5, 5])
//       ctx.stroke()
//       ctx.setLineDash([])

//       // NAT traversal label
//       ctx.fillStyle = "#6b7280"
//       ctx.font = "11px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText("NAT Traversal", x, serverY + 40)

//       // Draw signaling server
//       const signalingY = startY + height - 30
//       drawServer(x, signalingY, "Signaling Server")

//       // Draw signaling connections
//       ctx.beginPath()
//       ctx.moveTo(x - width / 2 + browserWidth / 2, startY + height / 2 + browserHeight / 4)
//       ctx.lineTo(x, signalingY - 20)
//       ctx.moveTo(x + width / 2 - browserWidth / 2, startY + height / 2 + browserHeight / 4)
//       ctx.lineTo(x, signalingY - 20)
//       ctx.strokeStyle = "#6b7280"
//       ctx.lineWidth = 1
//       ctx.setLineDash([5, 5])
//       ctx.stroke()
//       ctx.setLineDash([])

//       // Signaling label
//       ctx.fillStyle = "#6b7280"
//       ctx.font = "11px sans-serif"
//       ctx.textAlign = "center"
//       ctx.fillText("Signaling (SDP Exchange)", x, signalingY - 30)
//     }

//     const drawBrowser = (x: number, y: number, width: number, height: number, label: string) => {
//       // Browser window
//       ctx.fillStyle = "#ffffff"
//       ctx.beginPath()
//       ctx.roundRect(x - width / 2, y - height / 2, width, height, 5)
//       ctx.fill()
//       ctx.strokeStyle = "#d1d5db"
//       ctx.lineWidth = 1
//       ctx.stroke()

//       // Browser header
//       ctx.fillStyle = "#f3f4f6"
//       ctx.beginPath()
//       ctx.roundRect(x - width / 2, y - height / 2, width, 20, [5, 5, 0, 0])
//       ctx.fill()
//       ctx.strokeStyle = "#d1d5db"
//       ctx.lineWidth = 1
//       ctx.beginPath()
//       ctx.moveTo(x - width / 2, y - height / 2 + 20)
//       ctx.lineTo(x + width / 2, y - height / 2 + 20)
//       ctx.stroke()

//       // Browser controls
//       ctx.fillStyle = "#ef4444"
//       ctx.beginPath()
//       ctx.arc(x - width / 2 + 10, y - height / 2 + 10, 3, 0, Math.PI * 2)
//       ctx.fill()

//       ctx.fillStyle = "#f59e0b"
//       ctx.beginPath()
//       ctx.arc(x - width / 2 + 20, y - height / 2 + 10, 3, 0, Math.PI * 2)
//       ctx.fill()

//       ctx.fillStyle = "#10b981"
//       ctx.beginPath()
//       ctx.arc(x - width / 2 + 30, y - height / 2 + 10, 3, 0, Math.PI * 2)
//       ctx.fill()

//       // Browser label
//       ctx.fillStyle = "#1f2937"
//       ctx.font = "bold 12px sans-serif"
//       ctx.textAlign = "center"
//       ctx.textBaseline = "middle"
//       ctx.fillText(label, x, y)

//       // WebRTC icon
//       ctx.fillStyle = "#3b82f6"
//       ctx.beginPath()
//       ctx.arc(x, y + 20, 10, 0, Math.PI * 2)
//       ctx.fill()

//       ctx.fillStyle = "#ffffff"
//       ctx.font = "bold 10px sans-serif"
//       ctx.textAlign = "center"
//       ctx.textBaseline = "middle"
//       ctx.fillText("RTC", x, y + 20)
//     }

//     const drawServer = (x: number, y: number, label: string) => {
//       // Server icon
//       ctx.fillStyle = "#8b5cf6"
//       ctx.beginPath()
//       ctx.roundRect(x - 40, y - 15, 80, 30, 5)
//       ctx.fill()

//       // Server label
//       ctx.fillStyle = "#ffffff"
//       ctx.font = "bold 11px sans-serif"
//       ctx.textAlign = "center"
//       ctx.textBaseline = "middle"
//       ctx.fillText(label, x, y)
//     }

//     const drawMediaFlow = () => {
//       const time = Date.now() / 1000
//       const startY = 250
//       const width = canvas.width - 100
//       const height = 200
//       const x = canvas.width / 2

//       const browserWidth = 120
//       const browserSpacing = width - browserWidth * 2

//       // Browser positions
//       const browser1X = x - width / 2 + browserWidth / 2
//       const browser2X = x + width / 2 - browserWidth / 2
//       const browserY = startY + height / 2

//       // Draw media packets flowing between browsers
//       const packetCount = 5

//       for (let i = 0; i < packetCount; i++) {
//         // Calculate packet position
//         const offset = (time + i / packetCount) % 1
//         const packetX = browser1X + (browser2X - browser1X) * offset

//         // Simulate jitter
//         const jitterEffect = (Math.sin(time * 10 + i) * rtpParams.jitter) / 20
//         const packetY = browserY + jitterEffect

//         // Skip some packets if packet loss is enabled
//         if (Math.random() * 100 < rtpParams.packetLoss) {
//           continue
//         }

//         // Draw packet
//         ctx.beginPath()
//         ctx.arc(packetX, packetY, 5, 0, Math.PI * 2)

//         // Color based on media type
//         let packetColor
//         let packetLabel

//         if (i % 3 === 0) {
//           packetColor = "#ef4444" // Video
//           packetLabel = "V"
//         } else if (i % 3 === 1) {
//           packetColor = "#3b82f6" // Audio
//           packetLabel = "A"
//         } else {
//           packetColor = "#10b981" // Data
//           packetLabel = "D"
//         }

//         ctx.fillStyle = packetColor
//         ctx.fill()

//         if (rtpParams.securityEnabled) {
//           // Draw lock icon for secure packets
//           ctx.strokeStyle = "#ffffff"
//           ctx.lineWidth = 1
//           ctx.stroke()

//           ctx.fillStyle = "#ffffff"
//           ctx.font = "bold 6px sans-serif"
//           ctx.textAlign = "center"
//           ctx.textBaseline = "middle"
//           ctx.fillText("🔒", packetX, packetY)
//         } else {
//           // Draw media type label
//           ctx.fillStyle = "#ffffff"
//           ctx.font = "bold 8px sans-serif"
//           ctx.textAlign = "center"
//           ctx.textBaseline = "middle"
//           ctx.fillText(packetLabel, packetX, packetY)
//         }
//       }

//       // Draw RTCP packets (feedback) flowing in reverse
//       if (Math.floor(time) % rtpParams.rtcpInterval === 0) {
//         const rtcpX = browser2X - (browser2X - browser1X) * ((time * 2) % 1)
//         const rtcpY = browserY + 10

//         // RTCP packet
//         ctx.beginPath()
//         ctx.rect(rtcpX - 8, rtcpY - 5, 16, 10)
//         ctx.fillStyle = "#8b5cf6"
//         ctx.fill()

//         // RTCP label
//         ctx.fillStyle = "#ffffff"
//         ctx.font = "bold 7px sans-serif"
//         ctx.textAlign = "center"
//         ctx.textBaseline = "middle"
//         ctx.fillText("RTCP", rtcpX, rtcpY)
//       }

//       // Draw video preview in browsers
//       drawVideoPreview(browser1X, browserY - 15, 40, 30, time)
//       drawVideoPreview(browser2X, browserY - 15, 40, 30, time + 0.1) // Slight delay
//     }

//     const drawVideoPreview = (x: number, y: number, width: number, height: number, time: number) => {
//       // Video background
//       ctx.fillStyle = "#000000"
//       ctx.fillRect(x - width / 2, y - height / 2, width, height)

//       // Simple animation for video content
//       const hue = (time * 20) % 360

//       // Draw a simple shape that moves
//       const shapeX = x - width / 4 + (Math.sin(time * 2) * width) / 8
//       const shapeY = y + (Math.cos(time * 2) * height) / 8

//       ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
//       ctx.beginPath()
//       ctx.arc(shapeX, shapeY, 5, 0, Math.PI * 2)
//       ctx.fill()

//       // Camera icon
//       ctx.fillStyle = "#ffffff"
//       ctx.font = "10px sans-serif"
//       ctx.textAlign = "right"
//       ctx.textBaseline = "top"
//       ctx.fillText("📹", x + width / 2 - 2, y - height / 2 + 2)
//     }

//     // Animation loop
//     let animationId: number

//     const animate = () => {
//       if (!isActive) {
//         cancelAnimationFrame(animationId)
//         return
//       }

//       drawWebRtcSimulation()
//       animationId = requestAnimationFrame(animate)
//     }

//     // Start/stop animation based on isActive
//     if (isActive) {
//       animationId = requestAnimationFrame(animate)
//     } else {
//       // Draw static view when not active
//       drawWebRtcSimulation()
//     }

//     return () => {
//       window.removeEventListener("resize", resizeCanvas)
//       cancelAnimationFrame(animationId)
//     }
//   }, [isActive, rtpParams])

//   return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
// }