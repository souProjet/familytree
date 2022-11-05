class Canvas {
    constructor(canvas) {
        this.canvas = canvas
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.ctx = canvas.getContext('2d');
        this.canvas.addEventListener('mousemove', this.mouseMove);
        this.canvas.addEventListener('click', this.click);
        this.clickedMember = null;
        this.contextMenu = document.querySelector('.context-menu');
        this.inDrag = { state: false, left: null, top: null }
        this.canvas.addEventListener('mousedown', this.mouseDown);
        this.canvas.addEventListener('mouseup', this.mouseUp);
        this.profileCard = document.querySelector('.profile');
        let self = this;
        this.profileCard.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!e.target.classList.contains('active')) {
                    self.profileCard.querySelectorAll('.btn').forEach(btn2 => {
                        btn2.classList.remove('active');
                    });
                    e.target.classList.add('active');
                    let activeMember = data.family.find(member => member.id == self.clickedMember)

                    self.profileCard.querySelector('.profile-image img').src = (activeMember.picture ? ('./api/picture/' + data.token + '_' + activeMember.picture) : ('./public/images/' + (activeMember.gender == 'female' ? 'male' : 'female') + 'Default.png'))
                    data.editMember(activeMember.id, 'gender', activeMember.gender == 'female' ? 'male' : 'female')

                }
            });
        });
        this.profileCard.querySelector('.profile-birthday').addEventListener('change', (e) => {
            if (e.target.value) {
                data.editMember(self.clickedMember, 'birthday', e.target.value.split('-').reverse().join('/'))
                data.editMember(self.clickedMember, 'age', ((new Date()).getFullYear() - parseInt(e.target.value.split('-')[0])).toString())
            }
        });
        this.uploadInput = document.querySelector('#upload');

        this.profileCard.querySelector('.profile-image img').addEventListener('click', () => self.uploadInput.click());

        this.uploadInput.addEventListener('change', (e) => {
            let file = e.target.files[0];
            if (file) {
                let fileExtension = file.name.split('.')[file.name.split('.').length - 1];
                let pictureId = data.createID(5) + '.' + fileExtension;
                let formData = new FormData();
                formData.append('picture', file);
                formData.append('id', pictureId)
                fetch('./api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + data.token
                    },
                    body: formData
                }).then(response => response.json()).then(returnData => {

                    if (returnData.completed) {
                        data.editMember(self.clickedMember, 'picture', pictureId);
                        self.uploadInput.value = '';
                    }
                })
            }
        })
    }
    mouseDown = (e) => canvas.inDrag = { state: true, left: e.offsetX, top: e.offsetY }
    mouseUp = (e) => {
        let deltaX = e.offsetX - canvas.inDrag.left;
        let deltaY = e.offsetY - canvas.inDrag.top;
        if (deltaX && deltaY) {
            // data.deltaPosition.forEach(member => {
            data.deltaPosition.left += deltaX
            data.deltaPosition.top += deltaY
                //});
                // canvas.canvas.style.left = 0;
                // canvas.canvas.style.top = 0;
            canvas.build(data.family)
        }

        canvas.inDrag = { state: false, left: null, top: null }
    }
    toogleContextMenu(state = true, left, top, inCouple = false, haveChild = false, memberId) {
        if (state) {
            this.contextMenu.style.left = left + "px";
            this.contextMenu.style.top = top + "px";
            if (!inCouple && !haveChild) {
                this.contextMenu.style.height = "120px";
                this.contextMenu.querySelector('.remove-member').style.display = "block";
                this.contextMenu.querySelector('.add-partner').style.display = "block";
            } else if (inCouple && !haveChild) {
                this.contextMenu.style.height = "80px";
                this.contextMenu.querySelector('.remove-member').style.display = "block";
                this.contextMenu.querySelector('.add-partner').style.display = "none";
            } else if (inCouple && haveChild) {
                this.contextMenu.style.height = "40px";
                this.contextMenu.querySelector('.remove-member').style.display = "none";
                this.contextMenu.querySelector('.add-partner').style.display = "none";
            } else if (!inCouple && haveChild) {
                this.contextMenu.style.height = "80px";
                this.contextMenu.querySelector('.remove-member').style.display = "none";
                this.contextMenu.querySelector('.add-partner').style.display = "block";
            }
            if (!data.family.find(member => member.id == memberId).depth && !haveChild) {
                this.contextMenu.style.height = (parseInt(this.contextMenu.style.height.split('px')[0]) - 40) + "px";
                this.contextMenu.querySelector('.remove-member').style.display = "none";
            }
            this.contextMenu.style.zIndex = "50";
            this.contextMenu.classList.remove('hide');
        } else {
            this.contextMenu.classList.add('hide');
            setTimeout(() => {
                this.contextMenu.style.zIndex = "-1";
                this.contextMenu.style.height = "120px";
            }, 200);
        }
    }
    clearAll = () => this.ctx.clearRect(0, 0, this.width, this.height)
    build(familytree) {
        this.clearAll();
        this.setMember(familytree[0])
        let self = this;

        if (familytree[0].with) {
            this.setMember(familytree.find(partner => partner.id == familytree[0].with), true);
        }
        buildingProcess(familytree, familytree[0]);

        function buildingProcess(familytree, member) {
            let children = member.children;
            if (children.length) {
                for (let i = 0; i < children.length; i++) {
                    let actualChild = familytree.find(child => child.id == children[i]);
                    self.setMember(actualChild);
                    if (actualChild.with) {
                        self.setMember(familytree.find(partner => partner.id == actualChild.with), true);
                        if (actualChild.children.length) {
                            buildingProcess(familytree, actualChild)
                        }
                    } else {
                        if (actualChild.children.length) {
                            buildingProcess(familytree, actualChild)
                        }
                    }
                }
            }
        }
    }

    mouseMove(event) {

        let left = event.offsetX;
        let top = event.offsetY;
        if (canvas.inDrag.state) {
            // let deltaX = left - canvas.inDrag.left;
            // let deltaY = top - canvas.inDrag.top;
            // canvas.canvas.style.left = deltaX + "px";
            // canvas.canvas.style.top = deltaY + "px";
            if (event.target.style.cursor != "grab") {
                event.target.style.cursor = "grab";
            }
        } else {
            event.target.style.cursor = "default";

            let cursorState = false;
            data.family.forEach(member => {
                if (left >= (member.left + data.deltaPosition.left) && left <= (member.left + data.deltaPosition.left) + member.height && top >= (member.top + data.deltaPosition.top) && top <= (member.top + data.deltaPosition.top) + member.height) {
                    event.target.style.cursor = "pointer";
                    cursorState = true
                }
            });
            if (event.target.style.cursor == "pointer" && !cursorState) {
                event.target.style.cursor = "default";
            }
        }
    }
    click(event) {
        let left = event.offsetX;
        let top = event.offsetY;
        let memberIsFind = false;
        canvas.profileCard.classList.add('hide');
        let newName = canvas.profileCard.querySelector('.profile-name').innerText;
        if (canvas.clickedMember && newName != data.family.find(member => member.id == canvas.clickedMember).name && newName && newName.length < 50) {
            data.editMember(canvas.clickedMember, 'name', newName)
        }
        data.family.forEach(member => {
            if (left >= member.left + data.deltaPosition.left && left <= member.left + data.deltaPosition.left + member.height && top >= member.top + data.deltaPosition.top && top <= member.top + data.deltaPosition.top + member.height) {
                canvas.clickedMember = member.id;
                memberIsFind = true;
                canvas.profileCard.querySelector('.profile-name').innerText = member.name;
                canvas.profileCard.querySelector('.profile-age').innerText = member.age + " ans";

                canvas.profileCard.querySelector('.profile-birthday').value = member.birthday.replace(/&#x2F;/gm, '/').split('/').reverse().join('-')
                canvas.profileCard.querySelector('.profile-image img').src = member.picture ? ('./api/picture/' + data.token + '_' + member.picture) : ('./public/images/' + member.gender + 'Default.png');

                canvas.profileCard.querySelectorAll('.btn')[0].classList.value = "btn " + (member.gender == 'male' ? 'active' : '')
                canvas.profileCard.querySelectorAll('.btn')[1].classList.value = "btn " + (member.gender == 'female' ? 'active' : '')

                canvas.profileCard.classList.remove('hide');

                canvas.toogleContextMenu(true, (member.left + data.deltaPosition.left) + member.height, (member.top + data.deltaPosition.top), member.with ? true : false, member.children.length ? true : false, member.id)
            }
        });
        if (!memberIsFind) {

            canvas.clickedMember = null;
            canvas.toogleContextMenu(false);
        }
    }

    setMember(member, isPartner = false) {
        let ctx = this.ctx
        let left = member.left + data.deltaPosition.left;

        let top = member.top + data.deltaPosition.top;
        let rayon = member.height / 2;
        let borderWeight = 10;

        //cercle    
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(left + rayon, top + rayon, member.height / 2, 0, 2 * Math.PI);
        ctx.fill();

        //bordure du cercle
        ctx.lineWidth = borderWeight;
        ctx.strokeStyle = "#bde582";
        ctx.beginPath();
        ctx.arc(left + rayon, top + rayon, (member.height / 2) - (borderWeight / 2), 0, 2 * Math.PI)
        ctx.stroke();

        //photo
        let picture = new Image();
        picture.src = `./public/images/${member.gender}Default.png`;
        picture.onload = () => {
            ctx.drawImage(picture, left, top, member.height, member.height - (borderWeight / 2))

            //bandeau
            ctx.beginPath();
            ctx.fillStyle = "#4abaae";
            ctx.moveTo(left, top + (member.height - 30 - borderWeight - 10))
            ctx.lineTo(left + member.height, top + (member.height - 30 - borderWeight - 10))
            ctx.lineTo(left + member.height - 20, top + (member.height - 15 - borderWeight - 10))
            ctx.lineTo(left + member.height, top + (member.height - borderWeight - 10))
            ctx.lineTo(left, top + (member.height - borderWeight - 10))
            ctx.lineTo(left + 20, top + (member.height - 15 - borderWeight - 10))
            ctx.lineTo(left, top + (member.height - 30 - borderWeight - 10))
            ctx.closePath()
            ctx.fill()

            //texte
            ctx.font = "20px serif"
            ctx.fillStyle = "white"
            let nameWidth = ctx.measureText(member.name).width;
            ctx.fillText(member.name, left + (member.height / 2 - nameWidth / 2), top + (member.height - borderWeight - 20))

            if (isPartner) {
                let partnerJSON = data.family.find(partner => partner.id == member.with);
                let linkLeft = (partnerJSON.left + data.deltaPosition.left + partnerJSON.height)
                let linkHeight = 13 - (member.depth > 0 ? (Math.log10(parseInt(member.depth) * (parseInt(member.depth) * 40))) : 0)
                let linkTop = top + member.height / 2 - linkHeight / 2
                let linkWidth = left - linkLeft
                this.setLink(linkLeft, linkTop, linkWidth, linkHeight)
            }
            let parents = data.family.filter(parent => parent.children.indexOf(member.id) != -1);
            if (parents.length) {
                let partnerLink = parents.length == 2 ? true : false
                let firstParent = partnerLink ? ((parents[0].left + data.deltaPosition.left) < (parents[1].left + data.deltaPosition.left) ? parents[0] : parents[1]) : parents[0]
                let secondeParent = partnerLink ? ((parents[0].left + data.deltaPosition.left) > (parents[1].left + data.deltaPosition.left) ? parents[0] : parents[1]) : undefined;
                let weight = parseFloat(member.depth ? (10 - Math.log10(member.depth * member.depth * 20)).toFixed(2) : 10);
                let startingPointLeft = partnerLink ? ((firstParent.left + data.deltaPosition.left) + firstParent.height + ((secondeParent.left + data.deltaPosition.left) - ((firstParent.left + data.deltaPosition.left) + firstParent.height)) / 2) : ((firstParent.left + data.deltaPosition.left) + parents[0].height / 2)
                let startingPointTop = partnerLink ? (firstParent.top + data.deltaPosition.top + firstParent.height / 2 + weight / 2) : firstParent.top + data.deltaPosition.top + firstParent.height;
                let endingPointLeft = left + member.height / 2;
                let endingPointTop = top;
                let cp1x, cp1y, cp2x, cp2y;
                let height = top - startingPointTop + weight;
                let width = startingPointLeft - endingPointLeft + weight
                cp1x = startingPointLeft;
                cp1y = endingPointTop;
                cp2x = endingPointLeft;
                cp2y = endingPointTop - height / 2;
                this.setLink(startingPointLeft, startingPointTop, null, null, true, cp1x, cp1y, cp2x, cp2y, endingPointLeft, endingPointTop, weight)
            }
        }
    }
    setLink(left, top, width, height, isCurve = false, cp1x, cp1y, cp2x, cp2y, x, y, weight) {
        let ctx = this.ctx;

        if (isCurve) {
            ctx.beginPath();
            ctx.strokeStyle = "#bde582";
            ctx.lineWidth = weight;
            ctx.moveTo(left, top)
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            ctx.stroke();
        } else {
            //draw line
            ctx.beginPath();
            ctx.fillStyle = "#bde582";
            ctx.rect(left, top, width, height)
            ctx.fill();
            //draw heart
            this.drawHeart(left + width / 2, top - height * 2, height * 3, height * 3, 'red')
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

    removeMember() {
        let memberID = this.clickedMember;
        data.removeMember(memberID);
        this.clickedMember = null;
        this.toogleContextMenu(false)
        this.build(data.family)
    }

    async addPartner() {
        let memberID = this.clickedMember;
        let newMemberReturn = await data.createMember([], memberID);
        if (newMemberReturn) {
            this.toogleContextMenu(false)
            this.build(data.family)
        }
    }

    async addChild() {
        let memberID = this.clickedMember;
        let parents = [memberID];
        if (data.family.find(partner => partner.id == memberID).with) { parents.push(data.family.find(partner => partner.id == memberID).with) }
        let newMemberReturn = await data.createMember(parents);
        if (newMemberReturn) {
            this.toogleContextMenu(false);
            this.build(data.family)
        }
    }

    // async exportCanvasAsPNG() {

    //     let maxWidth = 0;
    //     let maxHeight = 0;
    //     data.family.forEach(element => {
    //         if (element.left > maxWidth) {
    //             maxWidth = element.left + element.height;
    //         }
    //         if (element.top > maxHeight) {
    //             maxHeight = element.top + element.height;
    //         }
    //     })
    //     this.canvas.width = maxWidth;
    //     this.canvas.height = maxHeight;
    //     let returnedData = await data.adjustPositioning();
    //     if (returnedData) {
    //         setTimeout(() => {
    //             var MIME_TYPE = "image/png";

    //             var imgURL = this.canvas.toDataURL(MIME_TYPE);

    //             var dlLink = document.createElement('a');
    //             dlLink.download = 'arbre_généalogique.png';
    //             dlLink.href = imgURL;
    //             dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    //             document.body.appendChild(dlLink);
    //             dlLink.click();
    //             document.body.removeChild(dlLink);
    //             setTimeout(() => {
    //                 this.canvas.with = this.width;
    //                 this.canvas.height = this.height;
    //                 data.adjustPositioning();
    //             }, 200);
    //         }, 1000);
    //     }
    // }
}