"use client"

import { useEffect, useRef } from "react"

interface SdnIntegrationProps {
  isActive: boolean
}

export function SdnIntegration({ isActive }: SdnIntegrationProps) {
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

    // Draw SDN integration
    const drawSdnIntegration = () => {
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
      ctx.fillText("5G & SDN Integration", canvas.width / 2, 30)

      // Draw SDN architecture
      drawSdnArchitecture()

      // Draw 5G network
      draw5GNetwork()

      // Draw benefits
      drawBenefits()
    }

    const drawSdnArchitecture = () => {
      const startY = 70
      const width = canvas.width - 200
      const height = 180
      const x = canvas.width / 2

      // SDN architecture title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Software-Defined Networking Architecture", x, startY - 15)

      // Draw SDN layers
      const layerHeight = 40
      const layerSpacing = 10

      // Application layer
      drawSdnLayer(x, startY, width, layerHeight, "#3b82f6", "Application Layer")

      // Control layer
      drawSdnLayer(
        x,
        startY + layerHeight + layerSpacing,
        width,
        layerHeight,
        "#8b5cf6",
        "Control Layer (SDN Controller)",
      )

      // Infrastructure layer
      drawSdnLayer(
        x,
        startY + (layerHeight + layerSpacing) * 2,
        width,
        layerHeight,
        "#10b981",
        "Infrastructure Layer (Network Devices)",
      )

      // Draw connections between layers
      ctx.beginPath()
      ctx.moveTo(x, startY + layerHeight)
      ctx.lineTo(x, startY + layerHeight + layerSpacing)
      ctx.moveTo(x, startY + layerHeight * 2 + layerSpacing)
      ctx.lineTo(x, startY + layerHeight * 2 + layerSpacing * 2)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw APIs
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Northbound API", x - width / 2 + 10, startY + layerHeight + layerSpacing / 2)

      ctx.fillText("Southbound API (OpenFlow)", x - width / 2 + 10, startY + layerHeight * 2 + layerSpacing * 1.5)

      // Draw animated data flow
      if (isActive) {
        drawSdnDataFlow(x, startY, width, layerHeight, layerSpacing)
      }
    }

    const drawSdnLayer = (x: number, y: number, width: number, height: number, color: string, label: string) => {
      // Layer background
      ctx.fillStyle = color
      ctx.fillRect(x - width / 2, y, width, height)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, y, width, height)

      // Layer label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y + height / 2)
    }

    const drawSdnDataFlow = (x: number, startY: number, width: number, layerHeight: number, layerSpacing: number) => {
      const time = Date.now() / 1000

      // Data packets flowing between layers
      for (let i = 0; i < 3; i++) {
        const offset = (time + i / 3) % 1

        // Northbound API data flow (Application to Control)
        const northY = startY + layerHeight + layerSpacing * offset

        ctx.beginPath()
        ctx.arc(x - width / 4, northY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f688"
        ctx.fill()

        // Southbound API data flow (Control to Infrastructure)
        const southY = startY + layerHeight * 2 + layerSpacing + layerSpacing * offset

        ctx.beginPath()
        ctx.arc(x + width / 4, southY, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#8b5cf688"
        ctx.fill()
      }
    }

    const draw5GNetwork = () => {
      const startY = 280
      const width = canvas.width - 200
      const height = 120
      const x = canvas.width / 2

      // 5G network title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("5G Network Integration", x, startY - 10)

      // 5G network background
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(x - width / 2, startY, width, height)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, startY, width, height)

      // Draw 5G components
      const componentSpacing = width / 4

      // Core Network
      draw5GComponent(x - componentSpacing, startY + height / 2, "#ef4444", "5G Core")

      // Edge Computing
      draw5GComponent(x, startY + height / 2, "#f59e0b", "Edge Computing")

      // Radio Access Network
      draw5GComponent(x + componentSpacing, startY + height / 2, "#10b981", "Radio Access Network")

      // Draw connections
      ctx.beginPath()
      ctx.moveTo(x - componentSpacing + 25, startY + height / 2)
      ctx.lineTo(x - 25, startY + height / 2)
      ctx.moveTo(x + 25, startY + height / 2)
      ctx.lineTo(x + componentSpacing - 25, startY + height / 2)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw animated data flow
      if (isActive) {
        draw5GDataFlow(x, startY, componentSpacing, height)
      }
    }

    const draw5GComponent = (x: number, y: number, color: string, label: string) => {
      // Component circle
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Component label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y)
    }

    const draw5GDataFlow = (x: number, startY: number, componentSpacing: number, height: number) => {
      const time = Date.now() / 1000

      // Data packets flowing between components
      for (let i = 0; i < 2; i++) {
        const offset = (time + i / 2) % 1

        // Core to Edge
        const coreToEdgeX = x - componentSpacing + componentSpacing * offset

        ctx.beginPath()
        ctx.arc(coreToEdgeX, startY + height / 2 - 5, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#ef444488"
        ctx.fill()

        // Edge to RAN
        const edgeToRanX = x + componentSpacing * offset

        ctx.beginPath()
        ctx.arc(edgeToRanX, startY + height / 2 + 5, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#f59e0b88"
        ctx.fill()
      }
    }

    const drawBenefits = () => {
      const startY = 430
      const x = canvas.width / 2

      // Benefits title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Benefits of SDN & 5G Integration", x, startY - 10)

      // Draw benefit boxes
      const boxWidth = 150
      const boxHeight = 60
      const boxSpacing = 20

      // Benefit 1: Improved QoS
      drawBenefitBox(
        x - boxWidth - boxSpacing / 2,
        startY,
        boxWidth,
        boxHeight,
        "#3b82f6",
        "Improved QoS",
        "Dynamic traffic prioritization based on application needs",
      )

      // Benefit 2: Network Slicing
      drawBenefitBox(
        x + boxSpacing / 2,
        startY,
        boxWidth,
        boxHeight,
        "#8b5cf6",
        "Network Slicing",
        "Dedicated virtual networks for different service types",
      )

      // Benefit 3: Reduced Latency
      drawBenefitBox(
        x - boxWidth - boxSpacing / 2,
        startY + boxHeight + boxSpacing,
        boxWidth,
        boxHeight,
        "#10b981",
        "Reduced Latency",
        "Edge computing brings processing closer to users",
      )

      // Benefit 4: Adaptive Congestion Control
      drawBenefitBox(
        x + boxSpacing / 2,
        startY + boxHeight + boxSpacing,
        boxWidth,
        boxHeight,
        "#f59e0b",
        "Adaptive Congestion Control",
        "Real-time network condition monitoring and response",
      )
    }

    const drawBenefitBox = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string,
      title: string,
      description: string,
    ) => {
      // Box background
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, height)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      // Box title
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(title, x + width / 2, y + 10)

      // Box description
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      // Wrap text
      const maxWidth = width - 20
      const words = description.split(" ")
      let line = ""
      let lineY = y + 30

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " "
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, x + width / 2, lineY)
          line = words[i] + " "
          lineY += 12
        } else {
          line = testLine
        }
      }

      ctx.fillText(line, x + width / 2, lineY)
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawSdnIntegration()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawSdnIntegration()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

