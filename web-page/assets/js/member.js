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
            resolve({
                completed: true,
                family: this.family
            });
        });
    }
    removeMember(id) {
        return new Promise(async resolve => {
            if (id.match(/([A-Z0-9]{6})/g)) {
                if (this.family.find(member => member.id == id)) {
                    this.family = this.family.filter(member => member.id != id);
                    return {
                        completed: true,
                        family: this.family
                    }
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
    editMember(memberEdited) {

    }
}