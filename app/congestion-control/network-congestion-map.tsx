"use client"

import { useEffect, useRef } from "react"

interface NetworkCongestionMapProps {
  isActive: boolean
}

export function NetworkCongestionMap({ isActive }: NetworkCongestionMapProps) {
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

    // Network topology
    const nodes = [
      { id: "A", x: 100, y: 100, label: "Server", type: "server" },
      { id: "B", x: 250, y: 50, label: "Router 1", type: "router" },
      { id: "C", x: 400, y: 100, label: "Router 2", type: "router" },
      { id: "D", x: 550, y: 50, label: "Router 3", type: "router" },
      { id: "E", x: 700, y: 100, label: "Client", type: "client" },
      { id: "F", x: 250, y: 200, label: "Router 4", type: "router" },
      { id: "G", x: 400, y: 250, label: "Router 5", type: "router" },
      { id: "H", x: 550, y: 200, label: "Router 6", type: "router" },
    ]

    const links = [
      { source: "A", target: "B", congestion: 0 },
      { source: "B", target: "C", congestion: 0 },
      { source: "C", target: "D", congestion: 0 },
      { source: "D", target: "E", congestion: 0 },
      { source: "A", target: "F", congestion: 0 },
      { source: "F", target: "G", congestion: 0 },
      { source: "G", target: "H", congestion: 0 },
      { source: "H", target: "E", congestion: 0 },
      { source: "B", target: "F", congestion: 0 },
      { source: "C", target: "G", congestion: 0 },
      { source: "D", target: "H", congestion: 0 },
    ]

    // TCP variants
    const tcpVariants = [
      { name: "TCP Reno", color: "#3b82f6", packets: [] },
      { name: "TCP Cubic", color: "#10b981", packets: [] },
      { name: "TCP BBR", color: "#8b5cf6", packets: [] },
      { name: "TCP Vegas", color: "#f59e0b", packets: [] },
    ]

    // Draw network congestion map
    const drawNetworkCongestionMap = () => {
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
      ctx.fillText("Network Congestion Map", canvas.width / 2, 30)

      // Draw links
      for (const link of links) {
        const source = nodes.find((n) => n.id === link.source)
        const target = nodes.find((n) => n.id === link.target)

        if (source && target) {
          drawLink(source, target, link.congestion)
        }
      }

      // Draw nodes
      for (const node of nodes) {
        drawNode(node)
      }

      // Draw TCP variants legend
      drawTcpVariantsLegend()

      // Draw congestion level legend
      drawCongestionLegend()

      // Draw packets if active
      if (isActive) {
        updatePackets()
        drawPackets()
      }
    }

    const drawNode = (node: any) => {
      const radius = 20

      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)

      // Node color based on type
      switch (node.type) {
        case "server":
          ctx.fillStyle = "#3b82f6"
          break
        case "router":
          ctx.fillStyle = "#6b7280"
          break
        case "client":
          ctx.fillStyle = "#10b981"
          break
        default:
          ctx.fillStyle = "#6b7280"
      }

      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Node label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.id, node.x, node.y)

      // Node type label
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.fillText(node.label, node.x, node.y + radius + 15)
    }

    const drawLink = (source: any, target: any, congestion: number) => {
      // Link line
      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)

      // Link color based on congestion
      const congestionColor = getCongestionColor(congestion)
      ctx.strokeStyle = congestionColor

      // Link width based on congestion
      const baseWidth = 2
      const congestionWidth = Math.max(baseWidth, congestion * 5)
      ctx.lineWidth = congestionWidth

      ctx.stroke()

      // Congestion level indicator
      if (congestion > 0.3) {
        const midX = (source.x + target.x) / 2
        const midY = (source.y + target.y) / 2

        ctx.fillStyle = congestionColor
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${Math.round(congestion * 100)}%`, midX, midY - 15)
      }
    }

    const getCongestionColor = (congestion: number) => {
      if (congestion < 0.3) return "#10b981" // Green for low congestion
      if (congestion < 0.7) return "#f59e0b" // Yellow for medium congestion
      return "#ef4444" // Red for high congestion
    }

    const drawTcpVariantsLegend = () => {
      const legendY = canvas.height - 80
      const legendX = 100
      const legendSpacing = 150

      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("TCP Variants:", legendX, legendY)

      for (let i = 0; i < tcpVariants.length; i++) {
        const variant = tcpVariants[i]
        const x = legendX + legendSpacing * (i + 1)

        // Color indicator
        ctx.beginPath()
        ctx.arc(x - 10, legendY, 6, 0, Math.PI * 2)
        ctx.fillStyle = variant.color
        ctx.fill()

        // Variant name
        ctx.fillStyle = "#1f2937"
        ctx.font = "14px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(variant.name, x + 5, legendY)
      }
    }

    const drawCongestionLegend = () => {
      const legendY = canvas.height - 40
      const legendX = 100
      const legendWidth = 200
      const legendHeight = 15

      // Legend title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Congestion Level:", legendX, legendY)

      // Gradient bar
      const gradient = ctx.createLinearGradient(legendX + 150, 0, legendX + 150 + legendWidth, 0)
      gradient.addColorStop(0, "#10b981") // Green
      gradient.addColorStop(0.5, "#f59e0b") // Yellow
      gradient.addColorStop(1, "#ef4444") // Red

      ctx.fillStyle = gradient
      ctx.fillRect(legendX + 150, legendY - legendHeight / 2, legendWidth, legendHeight)

      // Labels
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Low", legendX + 150, legendY + 20)
      ctx.fillText("Medium", legendX + 150 + legendWidth / 2, legendY + 20)
      ctx.fillText("High", legendX + 150 + legendWidth, legendY + 20)
    }

    // Packet class
    class Packet {
      sourceId: string
      targetId: string
      progress: number
      color: string
      size: number
      speed: number
      path: string[]
      currentLinkIndex: number

      constructor(sourceId: string, targetId: string, color: string, path: string[]) {
        this.sourceId = sourceId
        this.targetId = targetId
        this.progress = 0
        this.color = color
        this.size = 6
        this.speed = 0.02
        this.path = path
        this.currentLinkIndex = 0
      }

      update() {
        this.progress += this.speed

        // Move to next link if progress is complete
        if (this.progress >= 1) {
          this.progress = 0
          this.currentLinkIndex++

          // If reached the end of the path, return false to remove packet
          if (this.currentLinkIndex >= this.path.length - 1) {
            return false
          }
        }

        return true
      }

      draw(ctx: CanvasRenderingContext2D) {
        const sourceNode = nodes.find((n) => n.id === this.path[this.currentLinkIndex])
        const targetNode = nodes.find((n) => n.id === this.path[this.currentLinkIndex + 1])

        if (sourceNode && targetNode) {
          const x = sourceNode.x + (targetNode.x - sourceNode.x) * this.progress
          const y = sourceNode.y + (targetNode.y - sourceNode.y) * this.progress

          // Packet circle
          ctx.beginPath()
          ctx.arc(x, y, this.size, 0, Math.PI * 2)
          ctx.fillStyle = this.color
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    // Update congestion levels
    const updateCongestion = () => {
      const time = Date.now() / 1000

      // Simulate congestion patterns
      for (const link of links) {
        // Base congestion
        let congestion = 0.2

        // Add time-based variation
        congestion += Math.sin(time + link.source.charCodeAt(0) + link.target.charCodeAt(0)) * 0.2

        // Add packet-based congestion
        const packetsOnLink = tcpVariants
          .flatMap((v) => v.packets)
          .filter((p) => {
            const currentLink = `${p.path[p.currentLinkIndex]}${p.path[p.currentLinkIndex + 1]}`
            const thisLink = `${link.source}${link.target}`
            return currentLink === thisLink || currentLink === `${link.target}${link.source}`
          }).length

        congestion += packetsOnLink * 0.05

        // Clamp congestion between 0 and 1
        link.congestion = Math.max(0, Math.min(1, congestion))
      }
    }

    // Generate packets for each TCP variant
    const generatePackets = () => {
      const time = Date.now()

      for (let i = 0; i < tcpVariants.length; i++) {
        const variant = tcpVariants[i]

        // Generate new packet every 2 seconds for each variant
        if (time % (2000 + i * 500) < 50 && variant.packets.length < 10) {
          // Different TCP variants use different paths
          let path

          switch (i) {
            case 0: // TCP Reno - uses top path
              path = ["A", "B", "C", "D", "E"]
              break
            case 1: // TCP Cubic - uses bottom path
              path = ["A", "F", "G", "H", "E"]
              break
            case 2: // TCP BBR - adaptively chooses path
              path = Math.random() > 0.5 ? ["A", "B", "C", "D", "E"] : ["A", "F", "G", "H", "E"]
              break
            case 3: // TCP Vegas - uses mixed path
              path = ["A", "B", "F", "G", "H", "E"]
              break
            default:
              path = ["A", "B", "C", "D", "E"]
          }

          variant.packets.push(new Packet("A", "E", variant.color, path))
        }
      }
    }

    // Update packets
    const updatePackets = () => {
      // Update congestion
      updateCongestion()

      // Generate new packets
      generatePackets()

      // Update existing packets
      for (const variant of tcpVariants) {
        variant.packets = variant.packets.filter((packet) => {
          return packet.update()
        })
      }
    }

    // Draw packets
    const drawPackets = () => {
      for (const variant of tcpVariants) {
        for (const packet of variant.packets) {
          packet.draw(ctx)
        }
      }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawNetworkCongestionMap()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawNetworkCongestionMap()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

