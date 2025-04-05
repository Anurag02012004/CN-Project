"use client"

import { useEffect, useRef } from "react"

interface RealWorldApplicationsProps {
  isActive: boolean
}

export function RealWorldApplications({ isActive }: RealWorldApplicationsProps) {
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

    // Draw real-world applications
    const drawRealWorldApplications = () => {
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
      ctx.fillText("SCTP in Real-World Applications", canvas.width / 2, 30)

      // Draw application cards
      const cardWidth = Math.min(300, canvas.width / 3 - 40)
      const cardHeight = 200
      const cardSpacing = 20
      const startY = 60

      // Financial transactions
      drawApplicationCard(
        canvas.width / 2 - cardWidth - cardSpacing,
        startY,
        cardWidth,
        cardHeight,
        "Financial Transactions",
        "#3b82f6",
        "Reliable and secure transfer",
        isActive,
      )

      // Telecommunications
      drawApplicationCard(
        canvas.width / 2,
        startY,
        cardWidth,
        cardHeight,
        "Telecommunications",
        "#8b5cf6",
        "Signaling in VoIP, IMS, and LTE networks",
        isActive,
      )

      // IoT and 5G
      drawApplicationCard(
        canvas.width / 2 + cardWidth + cardSpacing,
        startY,
        cardWidth,
        cardHeight,
        "IoT and 5G Networks",
        "#10b981",
        "Reliable communication",
        isActive,
      )

      // Draw case study
      drawCaseStudy(startY + cardHeight + 40)
    }

    const drawApplicationCard = (
      x: number,
      y: number,
      width: number,
      height: number,
      title: string,
      color: string,
      description: string,
      animate: boolean,
    ) => {
      // Card background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x - width / 2, y, width, height)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, y, width, height)

      // Card header
      ctx.fillStyle = color
      ctx.fillRect(x - width / 2, y, width, 40)

      // Card title
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(title, x, y + 20)

      // Card description
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(wrapText(description, width - 20), x, y + 60)

      // Draw animated icon
      if (animate) {
        drawAnimatedIcon(x, y + 120, title, color)
      } else {
        drawStaticIcon(x, y + 120, title, color)
      }
    }

    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(" ")
      const lines = []
      let currentLine = words[0]

      ctx.font = "12px sans-serif"

      for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const width = ctx.measureText(currentLine + " " + word).width

        if (width < maxWidth) {
          currentLine += " " + word
        } else {
          lines.push(currentLine)
          currentLine = word
        }
      }

      lines.push(currentLine)
      return lines.join("\n")
    }

    const drawAnimatedIcon = (x: number, y: number, type: string, color: string) => {
      const time = Date.now() / 1000

      switch (type) {
        case "Financial Transactions":
          // Animated money transfer
          const offset = Math.sin(time * 2) * 10

          // Dollar sign
          ctx.fillStyle = color
          ctx.font = "bold 24px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("$", x - offset, y)

          // Arrow
          ctx.beginPath()
          ctx.moveTo(x - offset + 15, y)
          ctx.lineTo(x + offset - 15, y)
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.stroke()

          // Arrow head
          ctx.beginPath()
          ctx.moveTo(x + offset - 15, y)
          ctx.lineTo(x + offset - 20, y - 5)
          ctx.lineTo(x + offset - 20, y + 5)
          ctx.closePath()
          ctx.fillStyle = color
          ctx.fill()

          // Bank icon
          ctx.fillStyle = color
          ctx.font = "bold 24px sans-serif"
          ctx.fillText("🏦", x + offset, y)
          break

        case "Telecommunications":
          // Animated signal waves
          for (let i = 0; i < 3; i++) {
            const radius = 10 + i * 10
            const alpha = 1 - i * 0.2
            const pulseOffset = Math.sin(time * 3 + i) * 2

            ctx.beginPath()
            ctx.arc(x, y, radius + pulseOffset, 0, Math.PI * 2)
            ctx.strokeStyle = `${color}${Math.floor(alpha * 255)
              .toString(16)
              .padStart(2, "0")}`
            ctx.lineWidth = 2
            ctx.stroke()
          }

          // Phone icon
          ctx.fillStyle = color
          ctx.font = "bold 24px sans-serif"
          ctx.fillText("📱", x, y)
          break

        case "IoT and 5G Networks":
          // Animated connected devices
          const devices = [
            { icon: "🏠", angle: time },
            { icon: "🚗", angle: time + (Math.PI * 2) / 3 },
            { icon: "⌚", angle: time + (Math.PI * 4) / 3 },
          ]

          // Central hub
          ctx.beginPath()
          ctx.arc(x, y, 10, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()

          // Connected devices
          for (const device of devices) {
            const deviceX = x + Math.cos(device.angle) * 30
            const deviceY = y + Math.sin(device.angle) * 30

            // Connection line
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(deviceX, deviceY)
            ctx.strokeStyle = color
            ctx.lineWidth = 1
            ctx.stroke()

            // Device icon
            ctx.fillStyle = "#1f2937"
            ctx.font = "16px sans-serif"
            ctx.fillText(device.icon, deviceX, deviceY)
          }
          break
      }
    }

    const drawStaticIcon = (x: number, y: number, type: string, color: string) => {
      switch (type) {
        case "Financial Transactions":
          ctx.fillStyle = color
          ctx.font = "bold 24px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("💰", x, y)
          break

        case "Telecommunications":
          ctx.fillStyle = color
          ctx.font = "bold 24px sans-serif"
          ctx.fillText("📡", x, y)
          break

        case "IoT and 5G Networks":
          ctx.fillStyle = color
          ctx.font = "bold 24px sans-serif"
          ctx.fillText("🌐", x, y)
          break
      }
    }

    const drawCaseStudy = (y: number) => {
      const width = canvas.width - 100
      const height = 180
      const x = canvas.width / 2

      // Case study background
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(x - width / 2, y, width, height)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(x - width / 2, y, width, height)

      // Case study title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Case Study: Diameter Signaling in 4G/5G Networks", x, y + 20)

      // Case study content
      const content = [
        "SCTP is the mandatory transport protocol for Diameter signaling in 4G/5G networks.",
        "Benefits:",
        "• Multi-homing provides network redundancy for critical signaling",
        "• Multi-streaming allows parallel processing of different message types",
        "• Message-oriented delivery preserves message boundaries",
        "• Built-in heartbeat mechanism detects path failures quickly",
      ]

      for (let i = 0; i < content.length; i++) {
        ctx.fillStyle = i === 0 || i === 1 ? "#1f2937" : "#6b7280"
        ctx.font = i === 1 ? "bold 14px sans-serif" : "14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(content[i], x, y + 50 + i * 20)
      }

      // Draw animated network if active
      if (isActive) {
        drawAnimatedNetwork(x, y + height - 30)
      }
    }

    const drawAnimatedNetwork = (x: number, y: number) => {
      const time = Date.now() / 1000
      const nodeRadius = 8
      const nodeCount = 5
      const nodeSpacing = 40

      // Draw nodes
      for (let i = 0; i < nodeCount; i++) {
        const nodeX = x - ((nodeCount - 1) * nodeSpacing) / 2 + i * nodeSpacing

        ctx.beginPath()
        ctx.arc(nodeX, y, nodeRadius, 0, Math.PI * 2)
        ctx.fillStyle = i === 0 || i === nodeCount - 1 ? "#8b5cf6" : "#3b82f6"
        ctx.fill()

        // Node label
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(i === 0 ? "S" : i === nodeCount - 1 ? "D" : i.toString(), nodeX, y)
      }

      // Draw connections
      for (let i = 0; i < nodeCount - 1; i++) {
        const sourceX = x - ((nodeCount - 1) * nodeSpacing) / 2 + i * nodeSpacing
        const targetX = sourceX + nodeSpacing

        ctx.beginPath()
        ctx.moveTo(sourceX + nodeRadius, y)
        ctx.lineTo(targetX - nodeRadius, y)
        ctx.strokeStyle = "#6b7280"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw animated packets
      const packetCount = 3
      for (let i = 0; i < packetCount; i++) {
        const totalDistance = (nodeCount - 1) * nodeSpacing - 2 * nodeRadius
        const offset = (time + i / packetCount) % 1
        const packetX = x - ((nodeCount - 1) * nodeSpacing) / 2 + nodeRadius + totalDistance * offset

        ctx.beginPath()
        ctx.arc(packetX, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#10b981"
        ctx.fill()
      }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawRealWorldApplications()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawRealWorldApplications()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

