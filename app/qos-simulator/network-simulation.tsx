"use client"

import { useEffect, useRef } from "react"

interface NetworkSimulationProps {
  isActive: boolean
  networkParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    priorityQueue: boolean
  }
}

export function NetworkSimulation({ isActive, networkParams }: NetworkSimulationProps) {
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

    // Packet class for simulation
    class Packet {
      x: number
      y: number
      size: number
      speed: number
      color: string
      type: string
      dropped: boolean
      priority: number

      constructor(type: string) {
        this.x = 100
        this.y = canvas.height / 2 + (Math.random() * 40 - 20)
        this.type = type
        this.dropped = false

        // Different packet types have different properties
        switch (type) {
          case "voip":
            this.size = 6
            this.speed = 5 + networkParams.bandwidth / 20
            this.color = "#3b82f6" // blue
            this.priority = 3
            break
          case "video":
            this.size = 10
            this.speed = 4 + networkParams.bandwidth / 25
            this.color = "#ef4444" // red
            this.priority = 2
            break
          case "data":
            this.size = 8
            this.speed = 3 + networkParams.bandwidth / 30
            this.color = "#10b981" // green
            this.priority = 1
            break
          default:
            this.size = 7
            this.speed = 4
            this.color = "#6b7280" // gray
            this.priority = 0
        }

        // Apply priority queue if enabled
        if (networkParams.priorityQueue) {
          this.speed += this.priority * 0.5
        }
      }

      update() {
        // Apply jitter effect
        const jitterEffect = (Math.random() * networkParams.jitter) / 10 - networkParams.jitter / 20
        this.y += jitterEffect

        // Move packet
        this.x += this.speed

        // Simulate packet loss
        if (!this.dropped && Math.random() * 100 < networkParams.packetLoss) {
          this.dropped = true
          this.color = "#9ca3af" // gray
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Add glow effect for priority packets
        if (networkParams.priorityQueue && this.priority > 1 && !this.dropped) {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2)
          ctx.fillStyle = `${this.color}33`
          ctx.fill()
        }

        if (this.dropped) {
          ctx.beginPath()
          ctx.moveTo(this.x - this.size, this.y - this.size)
          ctx.lineTo(this.x + this.size, this.y + this.size)
          ctx.moveTo(this.x + this.size, this.y - this.size)
          ctx.lineTo(this.x - this.size, this.y + this.size)
          ctx.strokeStyle = "#ef4444"
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }
    }

    // Network nodes
    const drawNodes = () => {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "#f0f9ff")
      gradient.addColorStop(1, "#e0f2fe")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid lines
      ctx.beginPath()
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
      }
      ctx.strokeStyle = "#e5e7eb33"
      ctx.stroke()

      // Source node
      ctx.beginPath()
      ctx.arc(80, canvas.height / 2, 20, 0, Math.PI * 2)
      ctx.fillStyle = "#6366f1"
      ctx.fill()
      ctx.strokeStyle = "#4f46e5"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Source", 80, canvas.height / 2)

      // Destination node
      ctx.beginPath()
      ctx.arc(canvas.width - 80, canvas.height / 2, 20, 0, Math.PI * 2)
      ctx.fillStyle = "#6366f1"
      ctx.fill()
      ctx.strokeStyle = "#4f46e5"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Dest", canvas.width - 80, canvas.height / 2)

      // Connection line
      ctx.beginPath()
      ctx.moveTo(100, canvas.height / 2)
      ctx.lineTo(canvas.width - 100, canvas.height / 2)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 3
      ctx.stroke()

      // Latency indicator
      const latencyPos = canvas.width / 2
      ctx.beginPath()
      ctx.arc(latencyPos, canvas.height / 2, 25, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
      ctx.fill()
      ctx.strokeStyle = "#6366f1"
      ctx.lineWidth = 1
      ctx.stroke()

      // Latency pulse animation
      const pulseSize = 25 + Math.sin(Date.now() / 200) * 5
      ctx.beginPath()
      ctx.arc(latencyPos, canvas.height / 2, pulseSize, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = "#6366f1"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${networkParams.latency}ms`, latencyPos, canvas.height / 2)

      // Legend
      const legendY = canvas.height - 60
      const legendX = 20
      const legendSpacing = 80

      // VoIP
      ctx.beginPath()
      ctx.arc(legendX, legendY, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.fillStyle = "#1e3a8a"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("VoIP", legendX + 15, legendY)

      // Video
      ctx.beginPath()
      ctx.arc(legendX + legendSpacing, legendY, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#ef4444"
      ctx.fill()
      ctx.fillStyle = "#991b1b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Video", legendX + legendSpacing + 15, legendY)

      // Data
      ctx.beginPath()
      ctx.arc(legendX + legendSpacing * 2, legendY, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#10b981"
      ctx.fill()
      ctx.fillStyle = "#065f46"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Data", legendX + legendSpacing * 2 + 15, legendY)

      // Dropped
      ctx.beginPath()
      ctx.arc(legendX + legendSpacing * 3, legendY, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#9ca3af"
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(legendX + legendSpacing * 3 - 6, legendY - 6)
      ctx.lineTo(legendX + legendSpacing * 3 + 6, legendY + 6)
      ctx.moveTo(legendX + legendSpacing * 3 + 6, legendY - 6)
      ctx.lineTo(legendX + legendSpacing * 3 - 6, legendY + 6)
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = "#7f1d1d"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Dropped", legendX + legendSpacing * 3 + 15, legendY)
    }

    // Animation variables
    let packets: Packet[] = []
    let animationId: number
    let lastPacketTime = 0

    // Animation loop
    const animate = (timestamp: number) => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw network
      drawNodes()

      // Generate new packets
      if (timestamp - lastPacketTime > 300) {
        const types = ["voip", "video", "data"]
        const randomType = types[Math.floor(Math.random() * types.length)]
        packets.push(new Packet(randomType))
        lastPacketTime = timestamp
      }

      // Update and draw packets
      packets = packets.filter((packet) => {
        packet.update()
        packet.draw(ctx)
        return packet.x < canvas.width + 20
      })

      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static network when not active
      drawNodes()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, networkParams])

  return <canvas ref={canvasRef} className="w-full h-full rounded-md" />
}

