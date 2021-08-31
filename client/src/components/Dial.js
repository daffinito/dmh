import React, { Component } from 'react'
import styles from './styles/Dial.module.css'

class Dial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: this.props.width || 100,
            height: this.props.width || 100,
            mouseCoords: { x: 0, y: 0 },
            mouseAngle: 0,
            mouseDown: false,
            dragAngle: 0,
            positions: [],
            currentPosition: this.props.currentPosition,
            interval: 0,
            flat: this.props.flat ? true : false
        }

        this.drawCanvas = this.drawCanvas.bind(this)
        this.getCanvasScale = this.getCanvasScale.bind(this)
        this.drawToggle = this.drawToggle.bind(this)
        this.drawCircle = this.drawCircle.bind(this)
        this.drawTicks = this.drawTicks.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleTouchDown = this.handleTouchDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseAngle = this.handleMouseAngle.bind(this)
        this.getNewAngle = this.getNewAngle.bind(this)
        this.pushToPosition = this.pushToPosition.bind(this)
        this.createPositions = this.createPositions.bind(this)
        this.setAngle = this.setAngle.bind(this)
        this.setCurrentPosition = this.setCurrentPosition.bind(this)
        this.findClosestPosition = this.findClosestPosition.bind(this)
    }

    // Calculate ratio to scale canvas to avoid blurriness on High DPI devices
    getCanvasScale(ctx) {
        const devicePixelRatio = window.devicePixelRatio ||
            window.screen.deviceXDPI / window.screen.logicalXDPI || // IE10
            1
        const backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1
        return devicePixelRatio / backingStoreRatio
    }

    drawTicks(ctx, x, y, distance, tickRadius) {
        const { positions, currentPosition, flat } = this.state
        const { numberOfPositions, startAngle } = this.props

        for (let i = 0; i < numberOfPositions; i++) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate((positions[i] + startAngle + 90) * (Math.PI / 180))
            ctx.beginPath()
            ctx.arc(0, -(distance + tickRadius), tickRadius, 0, Math.PI * 2, true)
            ctx.lineWidth = 1
            const grd = ctx.createRadialGradient(1, -(distance + tickRadius) - 1, 0, 0, -(distance + tickRadius), tickRadius)

            if (currentPosition === i) {
                grd.addColorStop(0.000, 'rgba(255, 183, 117, 1)');
                grd.addColorStop(0.90, 'rgba(255, 127, 0, 1)');
                grd.addColorStop(1, 'rgba(255, 90, 0, 1)');
                ctx.fillStyle = grd
                if (!flat) {
                    ctx.shadowColor = 'rgba(255, 127, 0, 1)'
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 30;
                }
            } else {
                grd.addColorStop(0.000, 'rgba(122, 61, 0, 1)');
                grd.addColorStop(0.90, 'rgba(102, 50, 0, 1)');
                grd.addColorStop(1, 'rgba(81, 40, 0, 1)');
                ctx.fillStyle = grd
                if (!flat) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 1)'
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 30;
                }
            }
            ctx.lineWidth = .4
            ctx.stroke()
            ctx.lineWidth = 1
            ctx.fill()

            ctx.restore()
        }
    }

    drawToggle(ctx, x, y, width, height) {
        const leftX = -(width / 2)
        const rightX = (width / 2)
        const taperOffset = width / 3
        const tipDiameter = (width - (taperOffset * 2))
        const tipRadius = tipDiameter / 2
        const baseHeight = height - tipRadius
        let angle = this.props.startAngle + 90
        if (this.state.mouseDown) {
            angle += this.state.dragAngle
        } else {
            angle += this.state.positions[this.state.currentPosition]
        }

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle * (Math.PI / 180))
        ctx.translate(0, (baseHeight / 2))
        ctx.beginPath()
        // draw left line
        ctx.moveTo(leftX, 0)
        ctx.lineTo(leftX + taperOffset, -baseHeight)   // use negative for y axis
        // draw tip
        ctx.arcTo(0, -(height + tipDiameter), rightX - taperOffset, -baseHeight, tipRadius)
        // draw right line
        ctx.lineTo(rightX, 0)
        // draw base
        ctx.lineTo(leftX, 0)
        ctx.lineWidth = 1
        if (!this.state.flat) {
            ctx.shadowColor = 'rgba(0, 0, 0, 1)'
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 30;
        }
        const grd = ctx.createLinearGradient(leftX, y, rightX, y);

        // Add colors
        grd.addColorStop(0, 'rgba(75, 75, 75, 1)');
        grd.addColorStop(0.48, 'rgba(140, 140, 140, 1)');
        grd.addColorStop(0.52, 'rgba(140, 140, 140, 1)');
        grd.addColorStop(1, 'rgba(75, 75, 75, 1)');

        ctx.fillStyle = grd
        ctx.fill()
        ctx.strokeStyle = "dimgray"
        ctx.stroke()
        ctx.restore()
    }

    drawCircle(ctx, x, y, radius) {
        ctx.save()
        //outline
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.lineWidth = 1

        const outlinegrd = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);

        outlinegrd.addColorStop(0, 'rgba(175, 175, 175, 1)');
        outlinegrd.addColorStop(1, 'rgba(75, 75, 75, 1)');
        ctx.fillStyle = outlinegrd
        ctx.fill()

        // outer circle
        ctx.beginPath()
        ctx.arc(x, y, radius * .9, 0, Math.PI * 2, true)
        ctx.closePath()

        const outergrd = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
        outergrd.addColorStop(0.000, 'rgba(10, 10, 10, 1)');
        outergrd.addColorStop(0.5, 'rgba(40, 40, 40, 1)');
        outergrd.addColorStop(1, 'rgba(10, 10, 10, 1)');
        if (!this.state.flat) {
            ctx.shadowColor = 'rgba(175, 175, 175, 1)'
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 50;
        }
        ctx.fillStyle = outergrd
        ctx.fill()

        //inner
        ctx.beginPath()
        ctx.arc(x, y, radius * .7, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.lineWidth = 1
        if (!this.state.flat) {
            ctx.shadowColor = 'rgba(0, 0, 0, 1)'
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 30;
        }
        const innerfillgrd = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
        innerfillgrd.addColorStop(0.000, 'rgba(0, 0, 0, 1)');
        innerfillgrd.addColorStop(0.5, 'rgba(60, 60, 60, 1)');
        innerfillgrd.addColorStop(1, 'rgba(0, 0, 0, 1)');

        ctx.fillStyle = innerfillgrd
        ctx.fill()

        const innerstrokegrd = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
        innerstrokegrd.addColorStop(0.000, 'rgba(100, 100, 100, 1)');
        innerstrokegrd.addColorStop(1, 'rgba(170, 170, 170, 1)');
        ctx.strokeStyle = innerstrokegrd
        ctx.stroke()

        ctx.restore()
    }

    drawChoices(ctx, x, y, distance, tickRadius) {
        const { positions, height, currentPosition, flat } = this.state
        const { numberOfPositions, startAngle, choices } = this.props

        const fontSize = height / 18

        if (typeof choices !== "undefined") {
            for (let i = 0; i < numberOfPositions; i++) {
                ctx.save()
                ctx.translate(x, y)
                ctx.rotate((positions[i] + startAngle + 90) * (Math.PI / 180))
                ctx.translate(0, -(distance + tickRadius))
                ctx.rotate(-(positions[i] + startAngle + 90) * (Math.PI / 180))
                ctx.font = String(fontSize) + "px Nunito"
                ctx.textAlign = "center"

                if (currentPosition === i) {
                    // webkit bug - can't do shadow on text with gradient. 
                    // have to draw shadow first!
                    ctx.lineWidth = 1
                    if (!flat) {
                        ctx.shadowColor = 'rgba(255, 90, 0, 1)'
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 30;
                    }
                    ctx.fillText(choices[i].description, 0, -(tickRadius + (fontSize / 2)));
                    // then set gradient after drawing shadow
                    const grd = ctx.createRadialGradient(0, -(tickRadius + fontSize), 0, 0, -(tickRadius + fontSize), tickRadius + fontSize)
                    grd.addColorStop(0.000, 'rgba(255, 183, 117, 1)');
                    grd.addColorStop(0.90, 'rgba(255, 127, 0, 1)');
                    grd.addColorStop(1, 'rgba(255, 127, 0, 1)');
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = grd
                } else {
                    ctx.fillStyle = 'rgba(81, 40, 0, 1)'
                    if (!flat) {
                        ctx.shadowColor = 'rgba(0, 0, 0, 1)'
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 30;
                    }
                }

                ctx.lineWidth = .7
                ctx.strokeText(choices[i].description, 0, -(tickRadius + (fontSize / 2)));
                ctx.lineWidth = 1
                ctx.fillText(choices[i].description, 0, -(tickRadius + (fontSize / 2)));

                ctx.restore()
            }
        }
    }
    /*
        drawMousePointer(ctx, x, y, style) {
            ctx.beginPath()
            ctx.arc(x, y, 25, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fillStyle = style
            ctx.fill()
        }
    */
    drawCanvas() {
        const ctx = this.canvasRef.getContext('2d')
        const scale = this.getCanvasScale(ctx)
        const { width, height } = this.state
        this.canvasRef.width = width * scale
        this.canvasRef.height = height * scale
        ctx.scale(scale, scale)

        const xCenter = width / 2
        const yCenter = height / 1.7
        const circleRadius = (width / 2) * .55
        const toggleHeight = width * .65
        const toggleWidth = toggleHeight / 5
        const tickDistance = (width / 2) * .72
        const tickRadius = circleRadius * .1

        this.drawChoices(ctx, xCenter, yCenter, tickDistance, tickRadius)
        this.drawTicks(ctx, xCenter, yCenter, tickDistance, tickRadius)
        this.drawCircle(ctx, xCenter, yCenter, circleRadius)
        this.drawToggle(ctx, xCenter, yCenter, toggleWidth, toggleHeight)
        //  this.drawMousePointer(ctx, this.state.mouseCoords.x, this.state.mouseCoords.y, "red")
    }

    handleMouseDown(e) {
        this.setState(() => ({
            mouseDown: true
        }))
        this.handleMouseAngle(e.clientX, e.clientY)
    }

    handleTouchDown(e) {
        this.setState(() => ({
            mouseDown: true
        }))
        this.handleMouseAngle(e.touches[0].clientX, e.touches[0].clientY)
    }

    handleMouseUp(e) {
        this.setState(() => ({
            mouseDown: false
        }))
        this.pushToPosition()
        this.props.onChange(this.state.currentPosition)
    }

    handleMouseMove(e) {
        if (this.state.mouseDown) {
            this.handleMouseAngle(e.clientX, e.clientY)
        }
    }

    handleTouchMove(e) {
        e.preventDefault()
        if (this.state.mouseDown) {
            this.handleMouseAngle(e.touches[0].clientX, e.touches[0].clientY)
        }
    }

    getMousePos = (rect, x, y) => {
        const m = {
            x: x - rect.left,
            y: y - rect.top
        }

        return m
    }

    handleMouseAngle(x, y) {
        const m = this.getMousePos(this.canvasRef.getBoundingClientRect(), x, y)
        const center = {
            x: this.state.width / 2,
            y: this.state.height / 2
        }
        const mouseAngle = (Math.atan2(m.y - center.y, m.x - center.x) * 180 / Math.PI)

        this.setState(() => ({
            mouseCoords: m,
            mouseAngle: mouseAngle
        }))

        const newAngle = this.getNewAngle(mouseAngle)
        this.setAngle(newAngle)
        this.findClosestPosition(newAngle)
    }

    getNewAngle(mouseAngle) {
        const { startAngle, maxAngle } = this.props
        const angleMod = (startAngle > 180 ? startAngle - 360 : startAngle)
        const lowerMaxAngle = -(maxAngle / 2)
        const upperMaxAngle = (maxAngle / 2)
        let angleCompare = mouseAngle - angleMod
        let retval = mouseAngle

        if (angleCompare > 180) {
            angleCompare -= 360
        }

        if (angleCompare < lowerMaxAngle) {
            retval = lowerMaxAngle
        } else if (angleCompare > upperMaxAngle) {
            retval = upperMaxAngle
        } else {
            retval -= angleMod
        }

        return retval
    }

    setAngle(angle) {
        this.setState(() => ({
            dragAngle: angle
        }))
    }

    pushToPosition() {
        const { positions, currentPosition } = this.state
        this.setAngle(positions[currentPosition])
    }

    findClosestPosition(angle) {
        const { positions, interval } = this.state
        const { numberOfPositions } = this.props
        if (angle > 180) {
            angle -= 360
        }
        let pushTo = 0
        let lowerPos = 0
        for (let i = 0; i < numberOfPositions; i++) {
            if (angle >= positions[i]) {
                lowerPos = i
            }
        }
        if (lowerPos === (numberOfPositions - 1)) {
            pushTo = lowerPos
        } else {
            let half = interval / 2
            let dif = Math.abs(positions[lowerPos] - angle)

            if (dif < half) {
                pushTo = lowerPos
            } else {
                pushTo = lowerPos + 1
            }
        }
        this.setCurrentPosition(pushTo)
    }

    setCurrentPosition(p) {
        this.setState(() => ({
            currentPosition: p
        }))

        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(p)
        }
    }

    createPositions(maxAngle, numberOfPositions) {
        if (maxAngle === undefined) {
            maxAngle = this.props.maxAngle
        }

        if (numberOfPositions === undefined) {
            numberOfPositions = this.props.numberOfPositions
        }

        const interval = maxAngle / (numberOfPositions - 1)
        let positions = []

        positions[0] = -(maxAngle / 2)
        for (let i = 1; i < numberOfPositions; i++) {
            positions[i] = positions[i - 1] + interval
        }

        this.setState(() => ({
            positions: positions,
            interval: interval
        }))
    }

    componentWillReceiveProps(nextProps) {
        if (+nextProps.width !== +this.state.width) {
            this.setState(() => ({
                width: nextProps.width,
                height: nextProps.width * .85,
            }))
        }
        if (+nextProps.currentPosition !== +this.state.currentPosition) {
            this.setCurrentPosition(nextProps.currentPosition)
        }
        if (+nextProps.numberOfPositions !== +this.props.numberOfPositions || +nextProps.maxAngle !== +this.props.maxAngle) {
            this.createPositions(nextProps.maxAngle, nextProps.numberOfPositions)
        }
    }

    componentDidUpdate() {
        this.drawCanvas()
    }

    componentDidMount() {
        this.createPositions()
        this.drawCanvas()
    }

    render() {
        const { className, readonly } = this.props
        const { width, height } = this.state

        return (
            <div
                style={{ width: width, height: height }}
                className={className}
            >
                <canvas
                    ref={(ref) => { this.canvasRef = ref }}
                    className={styles.canvasStyle}
                    onMouseDown={readonly ? null : this.handleMouseDown}
                    onTouchStart={readonly ? null : this.handleTouchDown}
                    onMouseMove={readonly ? null : this.handleMouseMove}
                    onTouchMove={readonly ? null : this.handleTouchMove}
                    onMouseUp={readonly ? null : this.handleMouseUp}
                    onTouchEnd={readonly ? null : this.handleMouseUp}
                />
            </div>
        )
    }
}

export default Dial
