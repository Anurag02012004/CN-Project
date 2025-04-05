"use client"

import { useEffect, useRef } from "react"

interface RtpSecurityProps {
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

export function RtpSecurity({ isActive, rtpParams }: RtpSecurityProps) {
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

    // Draw RTP security visualization
    const drawRtpSecurity = () => {
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
      ctx.fillText("Secure RTP (SRTP) Visualization", canvas.width / 2, 30)

      // Draw sender and receiver
      const senderX = 100
      const receiverX = canvas.width - 100
      const centerY = canvas.height / 3

      // Sender
      drawComputer(senderX, centerY, "Sender")

      // Receiver
      drawComputer(receiverX, centerY, "Receiver")

      // Draw RTP vs SRTP comparison
      drawRtpComparison(senderX, receiverX, centerY)

      // Draw SRTP packet structure
      drawSrtpPacket(canvas.width / 2, (canvas.height * 2) / 3)
    }

    const drawComputer = (x: number, y: number, label: string) => {
      // Monitor
      ctx.fillStyle = "#6366f1"
      ctx.fillRect(x - 25, y - 40, 50, 40)
      ctx.strokeStyle = "#4f46e5"
      ctx.lineWidth = 2
      ctx.strokeRect(x - 25, y - 40, 50, 40)

      // Screen
      ctx.fillStyle = "#bfdbfe"
      ctx.fillRect(x - 20, y - 35, 40, 30)

      // Stand
      ctx.fillStyle = "#6366f1"
      ctx.fillRect(x - 10, y, 20, 10)
      ctx.fillRect(x - 15, y + 10, 30, 5)

      // Label
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x, y + 30)
    }

    const drawRtpComparison = (startX: number, endX: number, y: number) => {
      const midX = canvas.width / 2

      // RTP flow (top)
      ctx.beginPath()
      ctx.moveTo(startX + 30, y - 20)
      ctx.lineTo(midX - 50, y - 20)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Attacker
      drawAttacker(midX, y - 50)

      // Compromised RTP flow
      ctx.beginPath()
      ctx.moveTo(midX + 50, y - 20)
      ctx.lineTo(endX - 30, y - 20)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // RTP label
      ctx.fillStyle = "#ef4444"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Unencrypted RTP (Vulnerable)", midX, y - 40)

      // SRTP flow (bottom)
      ctx.beginPath()
      ctx.moveTo(startX + 30, y + 20)
      ctx.lineTo(endX - 30, y + 20)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // SRTP label
      ctx.fillStyle = "#10b981"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Encrypted SRTP (Secure)", midX, y + 40)

      // Draw packets
      // Draw packets
      if (isActive) {
        const time = Date.now() / 1000;

        // RTP packets (unencrypted)
        for (let i = 0; i < 3; i++) {
          const offset = (time * 0.3 + i / 3) % 1;
          const x = startX + 30 + (midX - 80 - startX) * offset;

          // Packet
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(x - 10, y - 25, 20, 10);

          // Data (visible)
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "top"; // use top to avoid vertical overlap
          ctx.fillText("DATA", x, y - 38); // move text above packet with more space
        }

        // Compromised RTP packets
        for (let i = 0; i < 3; i++) {
          const offset = (time * 0.3 + i / 3) % 1;
          const x = midX + 50 + (endX - 30 - midX - 50) * offset;

          // Packet
          ctx.fillStyle = "#f59e0b";
          ctx.fillRect(x - 10, y - 25, 20, 10);

          // Modified data
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText("HACK", x, y - 38);
        }

        // SRTP packets (encrypted)
        for (let i = 0; i < 3; i++) {
          const offset = (time * 0.3 + i / 3) % 1;
          const x = startX + 30 + (endX - 30 - startX - 30) * offset;

          // Packet
          ctx.fillStyle = "#10b981";
          ctx.fillRect(x - 10, y + 15, 20, 10);

          // Encrypted data
          ctx.fillStyle = "#ffffff";
          ctx.font = "12px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText("🔒", x, y + 13); // move slightly above the packet
        }

        // Show attack attempt on SRTP if security is enabled
        if (rtpParams.securityEnabled && Math.floor(time) % 3 === 0) {
          // Attack arrow
          ctx.beginPath();
          ctx.moveTo(midX, y - 15);
          ctx.lineTo(midX, y + 15);
          ctx.strokeStyle = "#ef444488";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Arrow head
          ctx.beginPath();
          ctx.moveTo(midX, y + 15);
          ctx.lineTo(midX - 5, y + 10);
          ctx.lineTo(midX + 5, y + 10);
          ctx.closePath();
          ctx.fillStyle = "#ef444488";
          ctx.fill();

          // Failed attack indicator
          ctx.beginPath();
          ctx.arc(midX, y + 20, 10, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(midX - 5, y + 15);
          ctx.lineTo(midX + 5, y + 25);
          ctx.moveTo(midX + 5, y + 15);
          ctx.lineTo(midX - 5, y + 25);
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

    }

    const drawAttacker = (x: number, y: number) => {
      // Attacker icon
      ctx.beginPath()
      ctx.moveTo(x, y - 15)
      ctx.lineTo(x - 15, y)
      ctx.lineTo(x - 5, y)
      ctx.lineTo(x - 5, y + 15)
      ctx.lineTo(x + 5, y + 15)
      ctx.lineTo(x + 5, y)
      ctx.lineTo(x + 15, y)
      ctx.closePath()

      ctx.fillStyle = "#ef4444"
      ctx.fill()
      ctx.strokeStyle = "#b91c1c"
      ctx.lineWidth = 2
      ctx.stroke()

      // Attacker label
      ctx.fillStyle = "#ef4444"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Attacker", x, y + 30)

      // Attack arrow
      ctx.beginPath()
      ctx.moveTo(x, y + 5)
      ctx.lineTo(x, y - 15)
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(x, y - 15)
      ctx.lineTo(x - 5, y - 10)
      ctx.lineTo(x + 5, y - 10)
      ctx.closePath()
      ctx.fillStyle = "#ef4444"
      ctx.fill()
    }

    const drawSrtpPacket = (x: number, y: number) => {
      const packetWidth = 400
      const packetHeight = 120
      const startX = x - packetWidth / 2

      // Packet background
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(startX, y - packetHeight / 2, packetWidth, packetHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.strokeRect(startX, y - packetHeight / 2, packetWidth, packetHeight)

      // Packet title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        rtpParams.securityEnabled ? "SRTP Packet Structure" : "RTP Packet Structure",
        x,
        y - packetHeight / 2 - 10,
      )

      // Draw packet sections
      const sectionHeight = 30
      const sectionY = y - packetHeight / 2 + 15

      // RTP Header
      drawPacketSection(startX + 10, sectionY, packetWidth * 0.3, sectionHeight, "#3b82f6", "RTP Header")

      // Encrypted Payload
      drawPacketSection(
        startX + 10 + packetWidth * 0.3,
        sectionY,
        packetWidth * 0.4,
        sectionHeight,
        rtpParams.securityEnabled ? "#10b981" : "#f59e0b",
        rtpParams.securityEnabled ? "Encrypted Payload" : "Unencrypted Payload",
      )

      // Authentication Tag (only for SRTP)
      if (rtpParams.securityEnabled) {
        drawPacketSection(
          startX + 10 + packetWidth * 0.7,
          sectionY,
          packetWidth * 0.2 - 20,
          sectionHeight,
          "#8b5cf6",
          "Auth Tag",
        )
      }

      // Draw security features
      const featuresY = y + 20

      if (rtpParams.securityEnabled) {
        // Confidentiality
        drawSecurityFeature(
          startX + 80,
          featuresY,
          "#10b981",
          "Confidentiality",
          "AES encryption",
        )

        // Integrity
        drawSecurityFeature(x, featuresY, "#8b5cf6", "Integrity", "HMAC authentication")

        // Replay Protection
        drawSecurityFeature(
          startX + packetWidth - 80,
          featuresY,
          "#3b82f6",
          "Replay Protection",
          "num for replay attacks",
        )
      } else {
        // Security risks
        drawSecurityFeature(
          startX + 80,
          featuresY,
          "#ef4444",
          "No Confidentiality",
          "Payload data is transmitted in the clear",
        )
        drawSecurityFeature(x, featuresY, "#ef4444", "No Integrity", "Packets can be modified in transit")
        drawSecurityFeature(
          startX + packetWidth - 80,
          featuresY,
          "#ef4444",
          "No Replay Protection",
          "Vulnerable to replay attacks",
        )
      }
    }

    const drawPacketSection = (x: number, y: number, width: number, height: number, color: string, label: string) => {
      // Section background
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, height)

      // Section label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x + width / 2, y + height / 2)

      // Animated security effect
      if (isActive && rtpParams.securityEnabled && (label === "Encrypted Payload" || label === "Auth Tag")) {
        const time = Date.now() / 1000
        const sparkleCount = 5

        for (let i = 0; i < sparkleCount; i++) {
          const sparkleX = x + width * ((time * 0.5 + i / sparkleCount) % 1)
          const sparkleY = y + height / 2

          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const drawSecurityFeature = (x: number, y: number, color: string, title: string, description: string) => {
      // Icon
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Lock icon
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(color === "#ef4444" ? "❌" : "🔒", x, y)

      // Title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(title, x, y + 30)

      // Description
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(description, x, y + 50)
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawRtpSecurity()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawRtpSecurity()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, rtpParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

