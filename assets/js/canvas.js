class Canvas {
    constructor(canvas) {
        this.canvas = canvas
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.ctx = canvas.getContext('2d');
        this.canvas.addEventListener('mousemove', this.mouseMove);
        this.canvas.addEventListener('click', this.click)
    }
    build(familytree) {

        this.setMember(familytree[0])
        if (familytree[0].with) {
            this.setMember(familytree.find(partner => partner.id == familytree[0].with), true);
        }
        buildingProcess(familytree, familytree[0]);

        function buildingProcess(familytree, member) {
            let children = member.children;
            if (children.length) {
                for (let i = 0; i < children.length; i++) {
                    let actualChild = familytree.find(child => child.id == children[i]);
                    this.setMember(actualChild);
                    if (actualChild.with) {
                        this.setMember(familytree.find(partner => partner.id == actualChild.with), true);
                        if (actualChild.children.length) {
                            buildingProcess(familytree, actualChild)
                        }
                    }
                }
            }
        }
    }
    clearAll() {
        this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    }
    mouseMove(event) {
        let left = event.offsetX;
        let top = event.offsetY;
        let cursorState = false;
        data.family.forEach(member => {
            let heightInPx = 250 * (parseInt(member.height.split('%')[0]) / 100);
            if (left >= member.left && left <= member.left + heightInPx && top >= member.top && top <= member.top + heightInPx) {
                event.target.style.cursor = "pointer";
                cursorState = true
            }
        });
        if (event.target.style.cursor == "pointer" && !cursorState) {
            event.target.style.cursor = "default";
        }
    }
    click(event) {
        let left = event.offsetX;
        let top = event.offsetY;
        data.family.forEach(member => {
            let heightInPx = 250 * (parseInt(member.height.split('%')[0]) / 100);
            if (left >= member.left && left <= member.left + heightInPx && top >= member.top && top <= member.top + heightInPx) {
                console.log(member)
            }
        });
    }
    setMember(member, isPartner = false) {
        let ctx = this.ctx
        let heightInPx = 250 * (parseInt(member.height.split('%')[0]) / 100);
        let left = member.left;
        let top = member.top;
        let rayon = heightInPx / 2;
        let borderWeight = 10;

        //cercle    
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(left + rayon, top + rayon, heightInPx / 2, 0, 2 * Math.PI);
        ctx.fill();

        //bordure du cercle
        ctx.lineWidth = borderWeight;
        ctx.strokeStyle = "#bde582";
        ctx.beginPath();
        ctx.arc(left + rayon, top + rayon, (heightInPx / 2) - (borderWeight / 2), 0, 2 * Math.PI)
        ctx.stroke();

        //photo
        let picture = new Image();
        picture.src = `./public/images/${member.gender}Default.png`;
        picture.onload = () => {
            ctx.drawImage(picture, left, top, heightInPx, heightInPx - (borderWeight / 2))

            //bandeau
            ctx.beginPath();
            ctx.fillStyle = "#4abaae";
            ctx.moveTo(left, top + (heightInPx - 30 - borderWeight - 10))
            ctx.lineTo(left + heightInPx, top + (heightInPx - 30 - borderWeight - 10))
            ctx.lineTo(left + heightInPx - 20, top + (heightInPx - 15 - borderWeight - 10))
            ctx.lineTo(left + heightInPx, top + (heightInPx - borderWeight - 10))
            ctx.lineTo(left, top + (heightInPx - borderWeight - 10))
            ctx.lineTo(left + 20, top + (heightInPx - 15 - borderWeight - 10))
            ctx.lineTo(left, top + (heightInPx - 30 - borderWeight - 10))
            ctx.closePath()
            ctx.fill()
                //texte
            ctx.font = "20px serif"
            ctx.fillStyle = "white"
            let nameWidth = ctx.measureText(member.name).width;
            ctx.fillText(member.name, left + (heightInPx / 2 - nameWidth / 2), top + (heightInPx - borderWeight - 20))

            if (isPartner) {
                let partnerJSON = data.family.find(partner => partner.id == member.with);
                let linkLeft = (partnerJSON.left + (250 * (parseInt(partnerJSON.height.split('%')[0]) / 100)))
                let linkHeight = 13 - (member.depth > 0 ? (Math.log10(parseInt(member.depth) * (parseInt(member.depth) * 40))) : 0)
                let linkTop = top + heightInPx / 2 - linkHeight / 2
                let linkWidth = left - linkLeft
                this.setLink(linkLeft, linkTop, linkWidth, linkHeight)
            }
        }
    }
    setLink(left, top, width, height, isCurve = false) {
        let ctx = this.ctx;
        if (isCurve) {

        } else {
            //draw line
            ctx.fillStyle = "#bde582";
            ctx.beginPath();
            ctx.rect(left, top, width, height)
            ctx.fill();
            //draw heart
            this.drawHeart(left + width / 2, top - height, height * 3, height * 3, 'red')
        }
    }

    drawHeart(fromx, fromy, lw, hlen, color) {
        let ctx = this.ctx
        let x = fromx;
        let y = fromy;
        let width = lw;
        let height = hlen;

        ctx.save();
        ctx.beginPath();
        let topCurveHeight = height * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
            x, y,
            x - width / 2, y,
            x - width / 2, y + topCurveHeight
        );

        // bottom left curve
        ctx.bezierCurveTo(
            x - width / 2, y + (height + topCurveHeight) / 2,
            x, y + (height + topCurveHeight) / 2,
            x, y + height
        );

        // bottom right curve
        ctx.bezierCurveTo(
            x, y + (height + topCurveHeight) / 2,
            x + width / 2, y + (height + topCurveHeight) / 2,
            x + width / 2, y + topCurveHeight
        );

        // top right curve
        ctx.bezierCurveTo(
            x + width / 2, y,
            x, y,
            x, y + topCurveHeight
        );

        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();

    }

}