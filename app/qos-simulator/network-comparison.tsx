"use client"

import { useEffect, useRef } from "react"

interface NetworkComparisonProps {
  isActive: boolean
  networkParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    priorityQueue: boolean
    networkType: string
    qosEnabled: boolean
    trafficShaping: string
    congestionAvoidance: string
    bufferSize: number
  }
}

export function NetworkComparison({ isActive, networkParams }: NetworkComparisonProps) {
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

    // Network technology parameters
    const networkTypes = [
      {
        name: "5G",
        color: "#3b82f6",
        bandwidth: 1000, // Mbps
        latency: 10, // ms
        jitter: 2, // ms
        packetLoss: 0.1, // %
        reliability: 99.999, // %
        coverage: 300, // meters
      },
      {
        name: "4G LTE",
        color: "#8b5cf6",
        bandwidth: 100, // Mbps
        latency: 50, // ms
        jitter: 10, // ms
        packetLoss: 1, // %
        reliability: 99.9, // %
        coverage: 1000, // meters
      },
      {
        name: "Wi-Fi",
        color: "#10b981",
        bandwidth: 300, // Mbps
        latency: 20, // ms
        jitter: 5, // ms
        packetLoss: 2, // %
        reliability: 99, // %
        coverage: 50, // meters
      },
    ]

    // Draw network comparison
    const drawNetworkComparison = () => {
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
      ctx.fillText("Network Technology Comparison", canvas.width / 2, 30)

      // Draw comparison chart
      drawComparisonChart()

      // Draw network visualization
      drawNetworkVisualization()
    }

    const drawComparisonChart = () => {
      const chartX = 50
      const chartY = 60
      const chartWidth = canvas.width - 100
      const chartHeight = 180
      const barWidth = chartWidth / 6 - 10
      const barSpacing = 10

      // Metrics to compare
      const metrics = ["Bandwidth", "Latency", "Jitter", "Packet Loss", "Reliability", "Coverage"]

      // Draw chart background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(chartX, chartY, chartWidth, chartHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(chartX, chartY, chartWidth, chartHeight)

      // Draw metric labels
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"

      for (let i = 0; i < metrics.length; i++) {
        const metricX = chartX + i * (barWidth + barSpacing) + barWidth / 2
        ctx.fillText(metrics[i], metricX, chartY + chartHeight + 15)
      }

      // Draw bars for each network type
      for (let i = 0; i < networkTypes.length; i++) {
        const network = networkTypes[i]

        // Draw network label
        ctx.fillStyle = network.color
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(network.name, chartX + i * 100 + 20, chartY - 10)

        // Draw colored square
        ctx.fillRect(chartX + i * 100, chartY - 20, 15, 15)

        // Draw bars for each metric
        for (let j = 0; j < metrics.length; j++) {
          const metricX = chartX + j * (barWidth + barSpacing)
          const barX = metricX + i * (barWidth / 3)

          // Calculate bar height based on metric
          let value = 0
          let maxValue = 1

          switch (j) {
            case 0: // Bandwidth
              value = network.bandwidth
              maxValue = 1000
              break
            case 1: // Latency (inverted - lower is better)
              value = 100 - (network.latency / 100) * 100
              maxValue = 100
              break
            case 2: // Jitter (inverted - lower is better)
              value = 100 - (network.jitter / 20) * 100
              maxValue = 100
              break
            case 3: // Packet Loss (inverted - lower is better)
              value = 100 - (network.packetLoss / 5) * 100
              maxValue = 100
              break
            case 4: // Reliability
              value = network.reliability
              maxValue = 100
              break
            case 5: // Coverage
              value = network.coverage
              maxValue = 1000
              break
          }

          const barHeight = (chartHeight - 20) * (value / maxValue)
          const barY = chartY + chartHeight - barHeight - 10

          // Draw bar
          ctx.fillStyle = `${network.color}88`
          ctx.fillRect(barX, barY, barWidth / 3 - 2, barHeight)
          ctx.strokeStyle = network.color
          ctx.lineWidth = 1
          ctx.strokeRect(barX, barY, barWidth / 3 - 2, barHeight)

          // Draw value
          if (j === 0) {
            // Bandwidth
            ctx.fillStyle = "#1f2937"
            ctx.font = "10px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(`${network.bandwidth}`, barX + barWidth / 6 - 1, barY - 5)
          } else if (j === 1) {
            // Latency
            ctx.fillStyle = "#1f2937"
            ctx.font = "10px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(`${network.latency}ms`, barX + barWidth / 6 - 1, barY - 5)
          }
        }
      }
    }

    const drawNetworkVisualization = () => {
      const startY = 280
      const height = 180

      // Draw selected network type
      let selectedNetwork = networkTypes[0] // Default to 5G

      if (networkParams.networkType === "lte") {
        selectedNetwork = networkTypes[1]
      } else if (networkParams.networkType === "wifi") {
        selectedNetwork = networkTypes[2]
      }

      // Draw network title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${selectedNetwork.name} Network Characteristics`, canvas.width / 2, startY)

      // Draw network visualization
      const centerX = canvas.width / 2
      const centerY = startY + height / 2

      // Draw base station/access point
      ctx.beginPath()
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
      ctx.fillStyle = selectedNetwork.color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw coverage area
      ctx.beginPath()
      ctx.arc(centerX, centerY, selectedNetwork.coverage / 10, 0, Math.PI * 2)
      ctx.fillStyle = `${selectedNetwork.color}22`
      ctx.fill()
      ctx.strokeStyle = selectedNetwork.color
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // Draw devices
      if (isActive) {
        const time = Date.now() / 1000
        const deviceCount = 8

        for (let i = 0; i < deviceCount; i++) {
          const angle = (i / deviceCount) * Math.PI * 2 + time * 0.2
          const distance = (50 + Math.sin(time + i) * 30) * (selectedNetwork.coverage / 500)
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance

          // Device
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#f3f4f6"
          ctx.fill()
          ctx.strokeStyle = "#6b7280"
          ctx.lineWidth = 1
          ctx.stroke()

          // Connection line
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(x, y)
          ctx.strokeStyle = `${selectedNetwork.color}88`
          ctx.lineWidth = 1
          ctx.stroke()

          // Data packets
          const packetCount = 2
          for (let j = 0; j < packetCount; j++) {
            const offset = ((time * selectedNetwork.bandwidth) / 500 + j / packetCount) % 1
            const packetX = centerX + (x - centerX) * offset
            const packetY = centerY + (y - centerY) * offset

            ctx.beginPath()
            ctx.arc(packetX, packetY, 3, 0, Math.PI * 2)
            ctx.fillStyle = selectedNetwork.color
            ctx.fill()
          }
        }
      }

      // Draw network characteristics
      const infoX = 100
      const infoY = startY + height - 30
      const infoSpacing = (canvas.width - 200) / 3

      // Bandwidth
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Bandwidth", infoX, infoY)

      ctx.fillStyle = selectedNetwork.color
      ctx.font = "14px sans-serif"
      ctx.fillText(`${selectedNetwork.bandwidth} Mbps`, infoX, infoY + 20)

      // Latency
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Latency", infoX + infoSpacing, infoY)

      ctx.fillStyle = selectedNetwork.color
      ctx.font = "14px sans-serif"
      ctx.fillText(`${selectedNetwork.latency} ms`, infoX + infoSpacing, infoY + 20)

      // Reliability
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Reliability", infoX + infoSpacing * 2, infoY)

      ctx.fillStyle = selectedNetwork.color
      ctx.font = "14px sans-serif"
      ctx.fillText(`${selectedNetwork.reliability}%`, infoX + infoSpacing * 2, infoY + 20)
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawNetworkComparison()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawNetworkComparison()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, networkParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

