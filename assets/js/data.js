class Data {
    constructor() {
        this.family = [];
    }
    createID = (length = 6) => {
        let token = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }
    createMember = async(parentsID = [], inCoupleWith = null) => {
        let newMemberID = this.createID();
        this.family.filter(member => parentsID.indexOf(member.id) != -1).forEach(member => member.children.push(newMemberID));

        let depth = 0;
        if (inCoupleWith) {
            depth = this.family.find(p => p.id == inCoupleWith).depth;
        } else {
            let acc = newMemberID
            while (this.family.find(m => m.children.indexOf(acc) != -1)) {
                depth++;
                acc = this.family.find(m => m.children.indexOf(acc) != -1).id;
                if (depth > 500) {
                    break;
                }
            }
        }

        let gender = inCoupleWith ? (this.family.find(p => p.id == inCoupleWith).gender == 'male' ? 'female' : 'male') : Math.floor(Math.random() * 2) ? 'male' : 'female';
        let name = (await fetch(`https://randomuser.me/api/?gender=${gender}&nat=fr&inc=name`).then(res => res.json())).results[0].name.first;
        let nationality = (await fetch(`https://api.nationalize.io?name=${name}`).then(res => res.json())).country[0].country_id;
        let age = (await fetch(`https://api.agify.io?name=${name}&country_id=${nationality}`).then(res => res.json())).age || Math.floor(Math.random() * 70 - 10) + 10;
        let birthday = new Date(Math.random() * (new Date('01-01-' + ((new Date()).getUTCFullYear() - age)).getTime() - new Date('12-31-' + ((new Date()).getUTCFullYear() - age)).getTime()) + new Date('12-31-' + ((new Date()).getUTCFullYear() - age)).getTime()).toLocaleDateString();
        let height = depth ? Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%" : "80%";
        this.family.push({
            "id": newMemberID,
            "name": name,
            "birthday": birthday,
            "age": age,
            "children": [],
            "with": inCoupleWith,
            "picture": false,
            "gender": gender,
            "nationality": nationality,
            "depth": depth,
            "height": height,
            "top": undefined,
            "left": undefined
        })
    }
    editMember = (id, key, newValue) => { this.family.find(member => member.id == id)[key] = newValue; }
    removeMember = (id) => { this.family.filter(member => member.id != id); }
    escapeHTML = (str) => { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
}