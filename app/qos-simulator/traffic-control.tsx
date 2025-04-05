"use client"

import { useEffect, useRef } from "react"

interface TrafficControlProps {
  isActive: boolean
  networkParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    priorityQueue: boolean
  }
}

export function TrafficControl({ isActive, networkParams }: TrafficControlProps) {
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
      priority: number
      inQueue: boolean
      queuePosition: number

      constructor(type: string, startX: number, lane: number) {
        this.x = startX
        this.y = 50 + lane * 50
        this.type = type
        this.inQueue = false
        this.queuePosition = 0

        // Different packet types have different properties
        switch (type) {
          case "voip":
            this.size = 8
            this.speed = 2
            this.color = "#3b82f6" // blue
            this.priority = 3
            break
          case "video":
            this.size = 12
            this.speed = 2
            this.color = "#ef4444" // red
            this.priority = 2
            break
          case "data":
            this.size = 10
            this.speed = 2
            this.color = "#10b981" // green
            this.priority = 1
            break
          default:
            this.size = 9
            this.speed = 2
            this.color = "#6b7280" // gray
            this.priority = 0
        }
      }

      update() {
        if (!this.inQueue) {
          this.x += this.speed
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw priority number
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.priority.toString(), this.x, this.y)
      }
    }

    // Queue class for traffic shaping
    class PriorityQueue {
      x: number
      y: number
      width: number
      height: number
      packets: Packet[]
      lastReleaseTime: number

      constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.packets = []
        this.lastReleaseTime = 0
      }

      addPacket(packet: Packet) {
        packet.inQueue = true

        if (networkParams.priorityQueue) {
          // Insert based on priority (higher priority first)
          let inserted = false
          for (let i = 0; i < this.packets.length; i++) {
            if (packet.priority > this.packets[i].priority) {
              this.packets.splice(i, 0, packet)
              inserted = true
              break
            }
          }
          if (!inserted) {
            this.packets.push(packet)
          }
        } else {
          // FIFO queue
          this.packets.push(packet)
        }

        // Update queue positions
        this.updatePositions()
      }

      updatePositions() {
        for (let i = 0; i < this.packets.length; i++) {
          this.packets[i].queuePosition = i
          this.packets[i].x = this.x + 20 + i * 25
          this.packets[i].y = this.y + this.height / 2
        }
      }

      releasePacket(timestamp: number) {
        // Release a packet every 500ms
        if (timestamp - this.lastReleaseTime > 500 && this.packets.length > 0) {
          const packet = this.packets.shift()
          if (packet) {
            packet.inQueue = false
            packet.x = this.x + this.width + 10
            packet.y = this.y + this.height / 2
            this.lastReleaseTime = timestamp
            this.updatePositions()
            return packet
          }
        }
        return null
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw queue box
        ctx.fillStyle = "#f3f4f6"
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 2
        ctx.strokeRect(this.x, this.y, this.width, this.height)

        // Draw queue label
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(
          networkParams.priorityQueue ? "Priority Queue" : "FIFO Queue",
          this.x + this.width / 2,
          this.y - 10,
        )

        // Draw packets in queue
        for (const packet of this.packets) {
          packet.draw(ctx)
        }
      }
    }

    // Draw network
    const drawNetwork = () => {
      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#f0f9ff")
      gradient.addColorStop(1, "#e0f2fe")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw lanes
      for (let i = 0; i < 3; i++) {
        const y = 50 + i * 50

        // Lane label
        let laneLabel = ""
        switch (i) {
          case 0:
            laneLabel = "VoIP Traffic"
            break
          case 1:
            laneLabel = "Video Traffic"
            break
          case 2:
            laneLabel = "Data Traffic"
            break
        }

        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(laneLabel, 10, y + 5)

        // Lane line
        ctx.beginPath()
        ctx.moveTo(120, y)
        ctx.lineTo(queueX, y)
        ctx.strokeStyle = "#d1d5db"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw output lane
      ctx.beginPath()
      ctx.moveTo(queueX + queueWidth + 10, queueY + queueHeight / 2)
      ctx.lineTo(canvas.width - 10, queueY + queueHeight / 2)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw legend
      const legendY = canvas.height - 40
      const legendX = 20
      const legendSpacing = 120

      // Priority Queue
      ctx.fillStyle = networkParams.priorityQueue ? "#3b82f6" : "#9ca3af"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Priority Queue: " + (networkParams.priorityQueue ? "ON" : "OFF"), legendX, legendY)

      // VoIP Priority
      ctx.beginPath()
      ctx.arc(legendX + legendSpacing, legendY - 5, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("3", legendX + legendSpacing, legendY - 5)

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("VoIP", legendX + legendSpacing + 15, legendY)

      // Video Priority
      ctx.beginPath()
      ctx.arc(legendX + legendSpacing * 2, legendY - 5, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#ef4444"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("2", legendX + legendSpacing * 2, legendY - 5)

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Video", legendX + legendSpacing * 2 + 15, legendY)

      // Data Priority
      ctx.beginPath()
      ctx.arc(legendX + legendSpacing * 3, legendY - 5, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#10b981"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("1", legendX + legendSpacing * 3, legendY - 5)

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Data", legendX + legendSpacing * 3 + 15, legendY)
    }

    // Queue position and size
    const queueX = canvas.width / 2 - 100
    const queueY = 75
    const queueWidth = 200
    const queueHeight = 100

    // Create priority queue
    const queue = new PriorityQueue(queueX, queueY, queueWidth, queueHeight)

    // Animation variables
    let packets: Packet[] = []
    let animationId: number
    const lastPacketTimes = [0, 0, 0]

    // Animation loop
    const animate = (timestamp: number) => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw network
      drawNetwork()

      // Generate new packets
      for (let lane = 0; lane < 3; lane++) {
        const packetInterval = 1000 + Math.random() * 1000
        if (timestamp - lastPacketTimes[lane] > packetInterval) {
          let type = ""
          switch (lane) {
            case 0:
              type = "voip"
              break
            case 1:
              type = "video"
              break
            case 2:
              type = "data"
              break
          }
          packets.push(new Packet(type, 120, lane))
          lastPacketTimes[lane] = timestamp
        }
      }

      // Update and draw packets
      packets = packets.filter((packet) => {
        if (!packet.inQueue && packet.x >= queueX && packet.x <= queueX + 10) {
          queue.addPacket(packet)
        }

        packet.update()
        packet.draw(ctx)

        return packet.x < canvas.width + 20
      })

      // Draw and update queue
      queue.draw(ctx)
      const releasedPacket = queue.releasePacket(timestamp)
      if (releasedPacket) {
        packets.push(releasedPacket)
      }

      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static network when not active
      drawNetwork()
      queue.draw(ctx)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, networkParams])

  return <canvas ref={canvasRef} className="w-full h-[300px] rounded-md" />
}

