class Member {
    constructor() {
        this.family = [];
        this.buildIteration = 2;
        this.familyServer = [];
    }
    build(familytree) {
        return new Promise(async resolve => {
            this.familyServer = familytree;
            document.body.style.opacity = .3;
            document.body.innerHTML += `
            <div class="building" style="z-index:1000;position:absolute;display:flex; flex-direction:column; justify-content:center; align-item:center; height:100vh; width:100vw; top:0;left:0;">
                <svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                    <circle fill="none" stroke="#fff" stroke-width="4" cx="50" cy="50" r="44" style="opacity:0.5;"></circle>
                    <circle fill="#fff" stroke="#e74c3c" stroke-width="3" cx="8" cy="54" r="6">
                        <animateTransform attributeName="transform" dur="2s" type="rotate" from="0 50 48" to="360 50 52" repeatCount="indefinite"></animateTransform>
                    </circle>
                </svg>
            </div>`
            let createFirstPersonReturn = await this.createMember(null, false, true, familytree[0])
            if (createFirstPersonReturn.completed) {
                let firstPartnerReturn = await this.createMember(familytree[0].id, false, true, familytree.find(m => m.id == familytree[0].with));
                if (firstPartnerReturn.completed) {
                    let addPartnerReturn = await this.addPartner(familytree[0].id, familytree[0].with, true)
                    if (addPartnerReturn.completed) {
                        createPartnerLink(familytree[0].id, familytree.find(m => m.id == familytree[0].with))
                        this.buildingState();
                        this.buildingProcess(familytree, familytree[0]);
                    }
                }
            }

        });
    }
    buildingProcess(familytree, memberJSON) {
        return new Promise(async resolve => {
            let children = memberJSON.children;
            if (children.length != 0) {
                for (let i = 0; i < children.length; i++) {
                    let createChildReturn = await this.createMember(null, false, true, familytree.find(c => c.id == children[i]));
                    createChildLink(memberJSON.id, familytree.find(c => c.id == children[i]))
                    if (createChildReturn.completed) {
                        this.buildingState();
                        if (familytree.find(c => c.id == children[i]).with) {
                            let createPartnerReturn = await this.createMember(children[i], false, true, familytree.find(m => m.id == familytree.find(c => c.id == children[i]).with));
                            if (createPartnerReturn.completed) {
                                let addPartnerReturn = await this.addPartner(children[i], familytree.find(c => c.id == children[i]).with, true)
                                if (addPartnerReturn.completed) {
                                    createPartnerLink(children[i], familytree.find(m => m.id == familytree.find(c => c.id == children[i]).with))
                                    this.buildingState();
                                    if (familytree.find(c => c.id == children[i]).children.length != 0) {
                                        this.buildingProcess(familytree, familytree.find(c => c.id == children[i]));
                                    }
                                }
                            }
                        } else {
                            if (familytree.find(c => c.id == children[i]).children.length != 0) {
                                this.buildingProcess(familytree, familytree.find(c => c.id == children[i]));
                            }
                        }
                    }

                }
            }
        });
    }
    buildingState() {
        if (this.buildIteration == this.familyServer.length) {
            setTimeout(() => {
                reComputeLink();
                document.querySelector('.building').remove();
                document.body.style.opacity = 1;
                document.querySelector('.container').addEventListener('click', () => { removeMemberFocusElements() });

            }, 500);
        }
        this.buildIteration++;

    }
    createMember(isPartner = null, parentsID = false, inBuilding = false, member = false) {
        return new Promise(async resolve => {
            let memberID = utils.createID();

            if (parentsID) {
                parentsID.forEach(parentID => {
                    if (parentID) {
                        if (parentID.match(/([A-Z0-9]{6})/g)) {
                            if (this.family.find(member => member.id == parentID)) {
                                this.family.find(member => member.id == parentID).children.push(memberID);
                            } else {
                                resolve({
                                    completed: false,
                                    error: `[${parentID}] : Membre non trouvé`
                                })
                            }
                        } else {
                            resolve({
                                completed: false,
                                error: `[${parentID}] : Ceci n'est pas un ID valide`
                            })
                        }
                    }
                });
            }

            let depth = 0;
            if (!member) {
                if (isPartner) {
                    depth = this.family.find(p => p.id == isPartner).depth;
                } else {
                    let acc = memberID
                    while (this.family.find(m => m.children.indexOf(acc) != -1)) {
                        depth++;
                        acc = this.family.find(m => m.children.indexOf(acc) != -1).id;
                        if (depth > 500) {
                            break;
                        }
                    }
                }
            }

            let newMember = {
                "id": memberID,
                "name": null,
                "birthday": null,
                "children": [],
                "with": null,
                "picture": false,
                "gender": isPartner ? (this.family.find(p => p.id == isPartner).gender == 'male' ? 'female' : 'male') : Math.floor(Math.random() * 2) ? 'male' : 'female',
                "nationality": null,
                "depth": depth,
                "order": document.querySelectorAll('.row')[depth] ? document.querySelectorAll('.row')[depth].querySelectorAll('.member').length + 1 : 1
            }
            if (member) {
                newMember = member;
            }

            this.family.push(newMember);

            let createHTMLmemberReturn = await this.createHTMLmember(this.family.find(e => e.id == newMember.id), isPartner, newMember.depth, parentsID ? parentsID[0] : null, newMember.order)
            if (createHTMLmemberReturn.completed) {
                if (!inBuilding) {
                    this.save();
                }
                resolve({
                    completed: true,
                    family: this.family,
                    newmember: newMember
                });
            } else {
                resolve({
                    completed: false,
                    error: createHTMLmemberReturn.error
                })
            }
        });
    }
    createHTMLmember(member, isPartner, depth, parentID, order) {
        return new Promise(async resolve => {
            try {
                if (!document.querySelectorAll('.row')[depth]) {
                    let rowDiv = document.createElement('div');
                    rowDiv.classList.add('row')
                    document.querySelector('.container').appendChild(rowDiv);
                }
                let row = document.querySelectorAll('.row')[depth];
                let gender = member.gender;
                let randomName = (await fetch(`https://randomuser.me/api/?gender=${gender}&nat=fr&inc=name`).then(res => res.json())).results[0].name
                if (isPartner) {
                    let memberDiv = document.createElement('div');
                    memberDiv.classList.add('member');
                    memberDiv.classList.add('hide');
                    memberDiv.style.order = order;
                    if (depth) {
                        memberDiv.style.height = Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%";
                    }
                    memberDiv.id = "m-" + member.id;
                    memberDiv.innerHTML = `
                        <div class="picture" onclick="memberClicked(event, this.parentNode);">
                            <img src="./images/${gender}Default.png" alt="Picture">
                        </div>
                        <p class="name">
                            <span class="hider-1"></span>
                            <span class="editable-name" contenteditable="true">${member.name ? member.name : (randomName.first + " " +randomName.last)}</span>
                            <span class="hider-2"></span>
                        </p>`;
                    document.querySelector('#m-' + (member.with ? member.with : isPartner)).insertAdjacentElement('afterend', memberDiv)
                } else {
                    let afterWho = parentID ? (this.family.find(m => m.id == parentID).children.length > 2 ? this.family.find(m => m.id == parentID).children[this.family.find(m => m.id == parentID).children.length - 2] : null) : null
                    if (!afterWho) {
                        if (parentID) {
                            let membersInRow = document.querySelector('#m-' + parentID).parentNode.querySelectorAll('.member');
                            let nextMember = null;
                            for (let n = 0; n < membersInRow.length; n++) {
                                if (membersInRow[n].id == "m-" + parentID && (membersInRow[n + 1] ? (membersInRow[n + 1].id != "m-" + this.family.find(m => m.id == parentID).with) : false) && this.family.find(m => m.id == membersInRow[n + 1].id.split('-')[1]).children != 0) {
                                    nextMember = membersInRow[n + 1];
                                }
                            }
                            if (nextMember) {
                                let nextMemberId = nextMember.id.split('-')[1];
                                let memberDiv = document.createElement('div');
                                memberDiv.classList.add('member');
                                memberDiv.classList.add('hide');
                                memberDiv.style.order = order;

                                if (depth) {
                                    memberDiv.style.height = Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%";
                                }
                                memberDiv.id = "m-" + member.id;

                                memberDiv.innerHTML = `
                                    <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                        <img src="./images/${gender}Default.png" alt="Picture">
                                    </div>
                                    <p class="name">
                                        <span class="hider-1"></span>
                                        <span class="editable-name" contenteditable="true">${member.name ? member.name : (randomName.first + " " +randomName.last)}</span>
                                        <span class="hider-2"></span>
                                    </p>`;
                                document.querySelector('#m-' + this.family.find(m => m.id == nextMemberId).children[0]).insertAdjacentElement('beforebegin', memberDiv)

                            } else {
                                let height = depth ? `style="height:` + Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + `%;"` : ``
                                row.innerHTML += `
                                    <div class="member hide" id="m-${member.id}" ${height}>
                                        <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                            <img src="./images/${gender}Default.png" alt="Picture">
                                        </div>
                                        <p class="name">
                                            <span class="hider-1"></span>
                                            <span class="editable-name" contenteditable="true">${member.name ? member.name : (randomName.first + " " +randomName.last)}</span>
                                            <span class="hider-2"></span></p>
                                    </div>`;
                            }
                        } else {
                            let height = depth ? `style="height:` + Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + `%;"` : ``
                            row.innerHTML += `
                                <div class="member hide" id="m-${member.id}" ${height}>
                                    <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                        <img src="./images/${gender}Default.png" alt="Picture">
                                    </div>
                                    <p class="name">
                                        <span class="hider-1"></span>
                                        <span class="editable-name" contenteditable="true">${member.name ? member.name : (randomName.first + " " +randomName.last)}</span>
                                        <span class="hider-2"></span></p>
                                </div>`;
                        }
                    } else {
                        let memberDiv = document.createElement('div');
                        memberDiv.classList.add('member');
                        memberDiv.classList.add('hide');
                        memberDiv.style.order = order;

                        if (depth) {
                            memberDiv.style.height = Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%";
                        }
                        memberDiv.id = "m-" + member.id;
                        memberDiv.innerHTML = `
                            <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                <img src="./images/${gender}Default.png" alt="Picture">
                            </div>
                            <p class="name">
                                <span class="hider-1"></span>
                                <span class="editable-name" contenteditable="true">${member.name ? member.name : (randomName.first + " " +randomName.last)}</span>
                                <span class="hider-2"></span>
                            </p>`;
                        document.querySelector('#m-' + afterWho).insertAdjacentElement('afterend', memberDiv);
                    }
                }

                setTimeout(() => {
                    row.querySelector('.member.hide').classList.remove('hide');
                    setTimeout(() => {
                        reComputeLink();
                        this.setOrder(row);
                        this.editNameEvent();
                    }, 100);
                }, 30);
            } catch (err) {
                resolve({
                    completed: false,
                    error: err
                });
            }

            resolve({
                completed: true,
                family: this.family
            })
        });
    }
    setOrder(raw) {
        let membersInRaw = raw.querySelectorAll('.member');
        for (let i = 0; i < membersInRaw.length; i++) {
            membersInRaw[i].style.order = i + 1;
            this.family.find(m => m.id == membersInRaw[i].id.split('-')[1]).order = i + 1
        }
    }
    removeMember(id) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id)) {
                    this.family = this.family.filter(member => member.id != id)
                    for (let i = 0; i < this.family.length; i++) {
                        this.family[i].children = this.family[i].children.filter(child => child != id);
                    }
                    this.save();
                    resolve({
                        completed: true,
                        family: this.family
                    })
                } else {
                    resolve({
                        completed: false,
                        error: `[${id}] : Membre non trouvé`
                    })
                }
            } else {
                resolve({
                    completed: false,
                    error: `[${id}] : Ceci n'est pas un ID valide`
                })
            }
        })
    }
    getMember(id) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id)) {
                    resolve({
                        completed: true,
                        member: this.family.find(member => member.id == id),
                        family: this.family
                    });
                } else {
                    resolve({
                        completed: false,
                        error: `[${id}] : Membre non trouvé`
                    })
                }
            } else {
                resolve({
                    completed: false,
                    error: `[${id}] : Ceci n'est pas un ID valide`
                })
            }
        });
    }
    addPartner(id, idPartner, inBuilding) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g) && idPartner.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id) && this.family.find(member => member.id == idPartner)) {
                    this.family.find(member => member.id == id).with = idPartner;
                    this.family.find(member => member.id == idPartner).with = id;
                    if (!inBuilding) {
                        this.save();
                    }
                    resolve({
                        completed: true,
                        family: this.family
                    })
                } else {
                    resolve({
                        completed: false,
                        error: `[${!this.family.find(member => member.id == id) ? id : idPartner}] : Ceci n'est pas un ID valide`
                    })
                }
            } else {
                resolve({
                    completed: false,
                    error: `[${!id.match(/([A-Z0-9]{6})/g) ? id : idPartner}] : Membre non trouvé`
                })

            }
        });
    }
    removePartner(id, idPartner) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g) && idPartner.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id) && this.family.find(member => member.id == idPartner)) {
                    this.family.find(member => member.id == id).with = null;
                    this.save();
                    resolve({
                        completed: true,
                        family: this.family
                    })
                } else {
                    resolve({
                        completed: false,
                        error: `[${!this.family.find(member => member.id == id) ? id : idPartner}] : Ceci n'est pas un ID valide`
                    })
                }
            } else {
                resolve({
                    completed: false,
                    error: `[${!id.match(/([A-Z0-9]{6})/g) ? id : idPartner}] : Membre non trouvé`
                })

            }
        });
    }
    editNameEvent() {
        document.querySelectorAll('.name').forEach(name => {
            name.removeEventListener('keypress', KeypressEvent)
            name.addEventListener('keypress', KeypressEvent)
        });
        let self = this;

        function KeypressEvent(e) {

            if (e.key == "Enter") {
                e.preventDefault();
                e.stopPropagation();
                self.editName(e.target.parentNode.parentNode.id.split('-')[1], utils.escapeHTML(e.target.innerText))
            }
        }
    }
    editName(id, newname) {
        this.family.find(m => m.id == id).name = newname;
        this.save();
    }
    save() {
        return new Promise(async resolve => {
            let response = await fetch('./save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token'),
                    tree: this.family
                })
            })
        });
    }
}