class Member {
    constructor() {
        this.family = [];
    }
    createMember(isPartner = null, parentsID) {
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
            let newMember = {
                "id": memberID,
                "firstname": null,
                "lastname": null,
                "birthday": null,
                "children": [],
                "with": null,
                "picture": false,
                "gender": null,
                "nationality": null,
                "depth": depth
            }
            this.family.push(newMember);

            let createHTMLmemberReturn = await this.createHTMLmember(this.family.find(e => e.id == memberID), isPartner, newMember.depth, parentsID ? parentsID[0] : null)
            if (createHTMLmemberReturn.completed) {
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
    createHTMLmember(member, isPartner, depth, parentID) {
        return new Promise(async resolve => {
            try {
                if (!document.querySelectorAll('.row')[depth]) {
                    let rowDiv = document.createElement('div');
                    rowDiv.classList.add('row')
                    document.querySelector('.container').appendChild(rowDiv);
                }
                let row = document.querySelectorAll('.row')[depth];
                if (isPartner) {
                    let memberDiv = document.createElement('div');
                    memberDiv.classList.add('member');
                    memberDiv.classList.add('hide');
                    if (depth) {
                        memberDiv.style.height = Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%";
                    }
                    memberDiv.id = "m-" + member.id;
                    let gender = document.querySelector('#m-' + isPartner).querySelector('img').src.indexOf('female') != -1 ? `male` : `female`;
                    let randomName = await fetch(`https://randomuser.me/api/?gender=${gender}&nat=fr&inc=name`).then(res => res.json())
                    memberDiv.innerHTML = `
                        <div class="picture" onclick="memberClicked(event, this.parentNode);">
                            <img src="./assets/images/${gender}Default.png" alt="Picture">
                        </div>
                        <p class="name">
                            <span class="hider-1"></span>
                            <span class="editable-name" contenteditable="true">${randomName.results[0].name.first}</span>
                            <span class="hider-2"></span>
                        </p>`;

                    document.querySelector('#m-' + isPartner).insertAdjacentElement('afterend', memberDiv)
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
                                if (depth) {
                                    memberDiv.style.height = Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%";
                                }
                                memberDiv.id = "m-" + member.id;
                                let gender = Math.floor(Math.random() * 2) ? 'male' : 'female';
                                let randomName = await fetch(`https://randomuser.me/api/?gender=${gender}&nat=fr&inc=name`).then(res => res.json())
                                memberDiv.innerHTML = `
                                    <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                        <img src="./assets/images/${gender}Default.png" alt="Picture">
                                    </div>
                                    <p class="name">
                                        <span class="hider-1"></span>
                                        <span class="editable-name" contenteditable="true">${randomName.results[0].name.first}</span>
                                        <span class="hider-2"></span>
                                    </p>`;
                                document.querySelector('#m-' + this.family.find(m => m.id == nextMemberId).children[0]).insertAdjacentElement('beforebegin', memberDiv)

                            } else {
                                let gender = Math.floor(Math.random() * 2) ? 'male' : 'female';
                                let randomName = (await fetch(`https://randomuser.me/api/?gender=${gender}&nat=fr&inc=name`).then(res => res.json())).results[0].name.first
                                let height = depth ? `style="height:` + Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + `%;"` : ``
                                row.innerHTML += `
                                    <div class="member hide" id="m-${member.id}" ${height}>
                                        <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                            <img src="./assets/images/${gender}Default.png" alt="Picture">
                                        </div>
                                        <p class="name">
                                            <span class="hider-1"></span>
                                            <span class="editable-name" contenteditable="true">${randomName}</span>
                                            <span class="hider-2"></span></p>
                                    </div>`;
                            }
                        } else {
                            let gender = Math.floor(Math.random() * 2) ? 'male' : 'female';
                            let randomName = (await fetch(`https://randomuser.me/api/?gender=m${gender}ale&nat=fr&inc=name`).then(res => res.json())).results[0].name.first
                            let height = depth ? `style="height:` + Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + `%;"` : ``
                            row.innerHTML += `
                                <div class="member hide" id="m-${member.id}" ${height}>
                                    <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                        <img src="./assets/images/${gender}Default.png" alt="Picture">
                                    </div>
                                    <p class="name">
                                        <span class="hider-1"></span>
                                        <span class="editable-name" contenteditable="true">${randomName}</span>
                                        <span class="hider-2"></span></p>
                                </div>`;
                        }
                    } else {
                        let memberDiv = document.createElement('div');
                        memberDiv.classList.add('member');
                        memberDiv.classList.add('hide');
                        if (depth) {
                            memberDiv.style.height = Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%";
                        }
                        memberDiv.id = "m-" + member.id;
                        let gender = Math.floor(Math.random() * 2) ? 'male' : 'female';
                        let randomName = await fetch(`https://randomuser.me/api/?gender=${gender}&nat=fr&inc=name`).then(res => res.json())
                        memberDiv.innerHTML = `
                            <div class="picture" onclick="memberClicked(event, this.parentNode);">
                                <img src="./assets/images/${gender}Default.png" alt="Picture">
                            </div>
                            <p class="name">
                                <span class="hider-1"></span>
                                <span class="editable-name" contenteditable="true">${randomName.results[0].name.first}</span>
                                <span class="hider-2"></span>
                            </p>`;
                        document.querySelector('#m-' + afterWho).insertAdjacentElement('afterend', memberDiv)
                    }
                }
                setTimeout(() => {
                    row.querySelector('.member.hide').classList.remove('hide');
                    setTimeout(() => {
                        reComputeLink();
                    }, 100);
                }, 30);
            } catch (err) {
                console.log(err)
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
    removeMember(id) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id)) {
                    this.family = this.family.filter(member => member.id != id)
                    for (let i = 0; i < this.family.length; i++) {
                        this.family[i].children = this.family[i].children.filter(child => child != id);
                    }
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
    addPartner(id, idPartner) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g) && idPartner.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id) && this.family.find(member => member.id == idPartner)) {
                    this.family.find(member => member.id == id).with = idPartner;
                    this.family.find(member => member.id == idPartner).with = id;
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
}