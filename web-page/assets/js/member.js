class Member {
    constructor() {
        this.family = [];
    }
    createMember(parentsID) {
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
            this.family.push({
                "id": memberID,
                "firstname": null,
                "lastname": null,
                "birthday": null,
                "children": [],
                "with": null,
                "picture": false,
                "gender": null,
                "nationality": null
            });
            let createHTMLmemberReturn = await this.createHTMLmember(this.family.find(e => e.id == memberID))
            if (createHTMLmemberReturn.completed) {
                resolve({
                    completed: true,
                    family: this.family
                });
            } else {
                resolve({
                    completed: false,
                    error: createHTMLmemberReturn.error
                })
            }
        });
    }
    createHTMLmember(member) {
        return new Promise(async resolve => {
            try {
                let row = document.querySelector('.row') ? document.querySelectorAll('.row')[this.family.find(m => m.children.indexOf(member.id) != -1) == undefined ? 0 : 1] : undefined
                if (!row) {
                    let rowDiv = document.createElement('div');
                    rowDiv.classList.add('row')
                    document.querySelector('.container').appendChild(rowDiv);
                }
                row = document.querySelector('.row') ? document.querySelectorAll('.row')[this.family.find(m => m.children.indexOf(member.id) != -1) == undefined ? 0 : 1] : undefined
                row.innerHTML += `
                    <div class="member hide" id="${member.id}" onclick="memberClicked(this);">
                        <div class="picture">
                            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png?w=360" alt="Picture">
                        </div>
                        <p class="name"><span class="hider-1"></span><span class="editable-name" contenteditable="true">Prénom</span><span class="hider-2"></span></p>
                    </div>
                `;
                setTimeout(() => { row.querySelector('.member.hide').classList.remove('hide') }, 10);
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
    editMember(memberEdited) {

    }


}