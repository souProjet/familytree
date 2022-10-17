class Member {
    constructor() {
        this.family = [];
    }
    createMember(isPartner = null, parentsID) {
        return new Promise(async resolve => {
            let memberID = utils.createID();

            if (parentsID) {
                parentsID.forEach(parentID => {
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
                });
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
                "nationality": null
            }
            this.family.push(newMember);
            let createHTMLmemberReturn = await this.createHTMLmember(this.family.find(e => e.id == memberID), isPartner)
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
    createHTMLmember(member, isPartner) {
            return new Promise(async resolve => {
                        try {
                            let row = document.querySelector('.row') ? document.querySelectorAll('.row')[this.family.find(m => m.children.indexOf(member.id) != -1) == undefined ? 0 : 1] : undefined
                            if (!row) {
                                let rowDiv = document.createElement('div');
                                rowDiv.classList.add('row')
                                document.querySelector('.container').appendChild(rowDiv);
                            }
                            row = document.querySelector('.row') ? document.querySelectorAll('.row')[this.family.find(m => m.children.indexOf(member.id) != -1) == undefined ? 0 : 1] : undefined
                            if (isPartner) {
                                let memberDiv = document.createElement('div');
                                memberDiv.classList.add('member');
                                memberDiv.classList.add('hide');
                                memberDiv.id = "m-" + member.id;
                                let gender = document.querySelector('#m-' + isPartner).querySelector('img').src.indexOf('male') == -1 ? `male` : `female`;
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
                                row.innerHTML += `
                    <div class="member hide" id="m-${member.id}">
                        <div class="picture" onclick="memberClicked(event, this.parentNode);">
                            <img src="./assets/images/maleDefault.png" alt="Picture">
                        </div>
                        <p class="name">
                            <span class="hider-1"></span>
                            <span class="editable-name" contenteditable="true">${(await fetch(`https://randomuser.me/api/?gender=male&nat=fr&inc=name`).then(res => res.json())).results[0].name.first}</span>
                            <span class="hider-2"></span></p>
                    </div>
                `;
                }
                setTimeout(() => {
                    //row.querySelector('.member.hide').style.order = row.querySelectorAll('.member').length;
                    row.querySelector('.member.hide').classList.remove('hide')
                }, 10);
                reComputePartnerLink();
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
    removeMember(id) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id)) {
                    this.family = this.family.filter(member => member.id != id);
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