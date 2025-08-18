"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Component() {
  const [activeStep, setActiveStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const isMobile = useIsMobile()

  // Define the 6 steps with their labels
  const steps = [
    { id: 1, label: "Engagement" },
    { id: 2, label: "Preparation" },
    { id: 3, label: "Outreach" },
    { id: 4, label: "Negotiation" },
    { id: 5, label: "Diligence" },
    { id: 6, label: "Completion" }
  ]

  // Manual step selection handler
  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId)
  }

  // Auto-advance animation every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => {
        if (prevStep < 6) {
          return prevStep + 1
        } else {
          // Reset to step 1 after completion
          return 1
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Function to generate SVG path for each segment (60 degrees each)
  const getSegmentPath = (index: number, radius: number, center: number) => {
    const startAngle = (index * 60 - 90) * (Math.PI / 180) // Start from top (-90 degrees)
    const endAngle = ((index + 1) * 60 - 90) * (Math.PI / 180)
    
    // Create segments only at the outer edge (ring effect) with curved edges
    const innerRadius = radius - 40 // Inner radius for the ring
    const outerRadius = radius // Outer radius
    
    // Create ring segment with curved edges using arc commands for consistency
    const x1Inner = Math.round(center + innerRadius * Math.cos(startAngle))
    const y1Inner = Math.round(center + innerRadius * Math.sin(startAngle))
    const x2Inner = Math.round(center + innerRadius * Math.cos(endAngle))
    const y2Inner = Math.round(center + innerRadius * Math.sin(endAngle))
    
    const x1Outer = Math.round(center + outerRadius * Math.cos(startAngle))
    const y1Outer = Math.round(center + outerRadius * Math.sin(startAngle))
    const x2Outer = Math.round(center + outerRadius * Math.cos(endAngle))
    const y2Outer = Math.round(center + outerRadius * Math.sin(endAngle))
    
    const largeArcFlag = 0 // 60 degrees is less than 180, so no large arc
    
    // Create curved ring segment with both edges following circular arcs
    return `M ${x1Inner} ${y1Inner} A ${innerRadius} ${innerRadius} 0 0 1 ${x2Inner} ${y2Inner} L ${x2Outer} ${y2Outer} A ${outerRadius} ${outerRadius} 0 0 0 ${x1Outer} ${y1Outer} L ${x1Inner} ${y1Inner} Z`
  }

  // Function to get position for step numbers
  const getStepPosition = (index: number, radius: number, center: number) => {
    const angle = (index * 60 - 30) * (Math.PI / 180) // Center of each segment
    // Position numbers on the strip/border area (between inner and outer radius)
    const stripRadius = radius - 20 // Position numbers on the strip
    const x = center + stripRadius * Math.cos(angle)
    const y = center + stripRadius * Math.sin(angle)
    return { x, y }
  }

  const radius = isMobile ? 122 : 138
  const center = isMobile ? 128 : 144

  return (
    <div className={`w-full max-w-6xl mx-auto bg-white ${isMobile ? 'px-4' : ''}`}>
      <div className={`flex items-center ${isMobile ? 'flex-col space-y-8' : 'justify-between'}`}>
        {/* Left Content */}
        <div className={`flex-1 ${isMobile ? 'text-center px-4' : 'pr-12'}`}>
          <h2 className={`font-bold text-gray-900 mb-6 ${isMobile ? 'text-3xl' : 'text-4xl'}`}>Our Transaction Process</h2>
          <p className={`text-gray-700 leading-relaxed mb-8 ${isMobile ? 'text-lg text-center max-w-full' : 'text-xl max-w-md'}`}>
            Our process guides you from assessment to completion with precision, ensuring a seamless transaction and
            minimal business disruption.
          </p>
          <Button
            className={`bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium text-lg ${isMobile ? 'px-6 py-3 text-base w-full max-w-xs' : 'px-8 py-4'}`}
            onClick={() => window.open('https://intellectuscapital.com.au/capabilities-2/', '_blank')}
          >
            Learn more
          </Button>
        </div>

        {/* Right Side - Process Visualization */}
        <div className={`flex justify-center items-center ${isMobile ? 'w-full' : 'flex-1'}`}>
          <div className={`relative ${isMobile ? 'w-80 h-72' : 'w-96 h-80'}`}>
            {/* Segmented Wheel */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`relative ${isMobile ? 'w-64 h-64' : 'w-72 h-72'}`}>
                {/* SVG for perfect circular segments */}
                <svg
                  width={isMobile ? "256" : "288"}
                  height={isMobile ? "256" : "288"}
                  viewBox={isMobile ? "0 0 256 256" : "0 0 288 288"}
                  className="absolute inset-0 cursor-pointer"
                >
                  {/* Progressive fill from step 1 to current active step */}
                  {(() => {
                    if (activeStep === 1) {
                      // Only step 1 active - just show first segment
                      return (
                        <path
                          key="progressive-fill"
                          d={getSegmentPath(0, radius, center)}
                          fill="#04ADEF"
                          className="transition-all duration-1000 ease-in-out opacity-90"
                          style={{ 
                            stroke: 'none',
                            strokeWidth: 0,
                            vectorEffect: 'non-scaling-stroke',
                            shapeRendering: 'geometricPrecision'
                          }}
                        />
                      )
                    } else if (activeStep === 6) {
                      // Step 6 active - fill the complete circle
                      const innerRadius = radius - 40
                      const outerRadius = radius
                      
                      // Create a complete circle path
                      const completeCirclePath = `M ${center + innerRadius} ${center} 
                                                A ${innerRadius} ${innerRadius} 0 1 1 ${center - innerRadius} ${center} 
                                                A ${innerRadius} ${innerRadius} 0 1 1 ${center + innerRadius} ${center} 
                                                M ${center + outerRadius} ${center} 
                                                A ${outerRadius} ${outerRadius} 0 1 0 ${center - outerRadius} ${center} 
                                                A ${outerRadius} ${outerRadius} 0 1 0 ${center + outerRadius} ${center} 
                                                Z`
                      
                      return (
                        <path
                          key="progressive-fill"
                          d={completeCirclePath}
                          fill="#04ADEF"
                          className="transition-all duration-1000 ease-in-out opacity-90"
                          style={{ 
                            stroke: 'none',
                            strokeWidth: 0,
                            vectorEffect: 'non-scaling-stroke',
                            shapeRendering: 'geometricPrecision'
                          }}
                        />
                      )
                    } else {
                      // Create progressive fill from step 1 to current active step (2-5)
                      const startAngle = (-90) * (Math.PI / 180) // Step 1 starts at top
                      const endAngle = (activeStep * 60 - 90) * (Math.PI / 180) // End at current step
                      
                      const innerRadius = radius - 40
                      const outerRadius = radius
                      
                      // Create a perfect circular strip path that follows the exact parameter
                      // Use the same logic as individual segments but create a continuous path
                      let progressivePath = ''
                      
                      // Generate the path by combining individual segment paths
                      for (let i = 0; i < activeStep; i++) {
                        const segmentStartAngle = (i * 60 - 90) * (Math.PI / 180)
                        const segmentEndAngle = ((i + 1) * 60 - 90) * (Math.PI / 180)
                        
                        const x1Inner = Math.round(center + innerRadius * Math.cos(segmentStartAngle))
                        const y1Inner = Math.round(center + innerRadius * Math.sin(segmentStartAngle))
                        const x2Inner = Math.round(center + innerRadius * Math.cos(segmentEndAngle))
                        const y2Inner = Math.round(center + innerRadius * Math.sin(segmentEndAngle))
                        
                        const x1Outer = Math.round(center + outerRadius * Math.cos(segmentStartAngle))
                        const y1Outer = Math.round(center + outerRadius * Math.sin(segmentStartAngle))
                        const x2Outer = Math.round(center + outerRadius * Math.cos(segmentEndAngle))
                        const y2Outer = Math.round(center + outerRadius * Math.sin(segmentEndAngle))
                        
                        if (i === 0) {
                          // First segment - start the path
                          progressivePath = `M ${x1Inner} ${y1Inner} A ${innerRadius} ${innerRadius} 0 0 1 ${x2Inner} ${y2Inner} L ${x2Outer} ${y2Outer} A ${outerRadius} ${outerRadius} 0 0 0 ${x1Outer} ${y1Outer} Z`
                        } else {
                          // Additional segments - add to existing path
                          progressivePath += ` M ${x1Inner} ${y1Inner} A ${innerRadius} ${innerRadius} 0 0 1 ${x2Inner} ${y2Inner} L ${x2Outer} ${y2Outer} A ${outerRadius} ${outerRadius} 0 0 0 ${x1Outer} ${y1Outer} Z`
                        }
                      }
                      
                      return (
                        <path
                          key="progressive-fill"
                          d={progressivePath}
                          fill="#04ADEF"
                          className="transition-all duration-1000 ease-in-out opacity-90"
                          style={{ 
                            stroke: 'none',
                            strokeWidth: 0,
                            vectorEffect: 'non-scaling-stroke',
                            shapeRendering: 'geometricPrecision'
                          }}
                        />
                      )
                    }
                  })()}
                  
                  {/* Individual segment outlines for interaction */}
                  {steps.map((step, index) => {
                    const segmentPath = getSegmentPath(index, radius, center)
                    
                    return (
                      <path
                        key={step.id}
                        d={segmentPath}
                        fill="transparent"
                        className={`cursor-pointer ${isMobile ? '' : 'hover:opacity-20'}`}
                        onClick={() => handleStepClick(step.id)}
                        style={{ 
                          cursor: 'pointer',
                          stroke: 'none',
                          strokeWidth: 0,
                          vectorEffect: 'non-scaling-stroke',
                          shapeRendering: 'crispEdges',
                          touchAction: isMobile ? 'manipulation' : 'auto'
                        }}
                      />
                    )
                  })}
                </svg>

                {/* Step numbers positioned on the strip/border area */}
                {steps.map((step, index) => {
                  const isActive = step.id === activeStep
                  const isCompleted = step.id < activeStep // Hide numbers of completed steps
                  const position = getStepPosition(index, radius, center)
                  
                  // Don't render numbers for completed steps
                  if (isCompleted) return null
                  
                  return (
                                          <div
                        key={step.id}
                        className={`absolute cursor-pointer ${isMobile ? 'touch-manipulation' : ''}`}
                        style={{
                          left: position.x - 20,
                          top: position.y - 20,
                          width: '40px',
                          height: '40px',
                        }}
                        onClick={() => handleStepClick(step.id)}
                      >
                      {isActive ? (
                        // Active step with dark circle badge
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {step.id}
                        </div>
                      ) : (
                        // Inactive step - grey circle with number
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                          {step.id}
                        </div>
                      )}
                      

                    </div>
                  )
                })}

                {/* Active step label */}
                {steps.map((step) => {
                  if (step.id === activeStep) {
                    const position = getStepPosition(step.id - 1, radius, center)
                    const isLeftSide = step.id >= 4 // Steps 4, 5, 6 show on left side
                    
                    // Special positioning for steps 3 and 6 to avoid overlap
                    let labelOffset
                    let verticalOffset = -10 // Default vertical position
                    
                    if (isMobile) {
                      // Mobile positioning - adjust for smaller screen
                      if (step.id === 3) {
                        labelOffset = 25 // Step 3: move right
                        verticalOffset = 15 // Step 3: label below the number
                      } else if (step.id === 4) {
                        labelOffset = -100 // Step 4: move left
                      } else if (step.id === 6) {
                        labelOffset = -110 // Step 6: move left
                        verticalOffset = -35 // Step 6: label above the number
                      } else if (isLeftSide) {
                        labelOffset = -95 // Other left side steps (5)
                      } else {
                        labelOffset = 20 // Right side steps (1, 2)
                      }
                    } else {
                      // Desktop positioning
                      if (step.id === 3) {
                        labelOffset = 35 // Step 3: move further right
                        verticalOffset = 20 // Step 3: label below the number
                      } else if (step.id === 4) {
                        labelOffset = -130 // Step 4: move slightly further left for gap
                      } else if (step.id === 6) {
                        labelOffset = -140 // Step 6: move further left
                        verticalOffset = -40 // Step 6: label above the number
                      } else if (isLeftSide) {
                        labelOffset = -120 // Other left side steps (5)
                      } else {
                        labelOffset = 25 // Right side steps (1, 2)
                      }
                    }
                    
                    return (
                      <div
                        key={`label-${step.id}`}
                        className={`absolute text-gray-900 font-semibold whitespace-nowrap ${isMobile ? 'text-sm' : 'text-lg'}`}
                        style={{
                          left: position.x + labelOffset,
                          top: position.y + verticalOffset,
                        }}
                      >
                        {step.label}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
