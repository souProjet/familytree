class Data {
    constructor() {
        this.family = [];
        this.token = localStorage.getItem('token')
        if (!this.token) {
            this.token = this.createID(10);
            localStorage.setItem('token', this.token);
            (async() => {
                let firstMember = await this.createMember();
                let partnerOfFirstMember = this.createMember([], firstMember.id)
            })();
        } else {
            (async() => {
                let getFamilytree = (await fetch('./api/get', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }, method: "GET" }).then(res => res.json()));
                if (getFamilytree.completed) {
                    this.family = getFamilytree.familytree;
                    canvas.build(this.family);
                } else {
                    console.error(getFamilytree.message)
                }
            })();
        }
    }
    createID(length = 6) {
        let token = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }
    async createMember(parentsID = [], inCoupleWith = null) {
        let newMemberID = this.createID();
        this.family.filter(member => parentsID.indexOf(member.id) != -1).forEach(member => member.children.push(newMemberID));

        let depth = 0;
        if (inCoupleWith) {
            this.family.find(member => member.id == inCoupleWith).with = newMemberID;
            this.save('edit', inCoupleWith, 'with', newMemberID)
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

        let age = inCoupleWith ? (this.family.find(p => p.id == inCoupleWith).age + Math.floor(Math.random() * 20) + (-10)) : (await fetch(`https://api.agify.io?name=${name}&country_id=${nationality}`).then(res => res.json())).age || Math.floor(Math.random() * 70 - 10) + 10;

        let birthday = new Date(Math.random() * (new Date('01-01-' + ((new Date()).getUTCFullYear() - age)).getTime() - new Date('12-31-' + ((new Date()).getUTCFullYear() - age)).getTime()) + new Date('12-31-' + ((new Date()).getUTCFullYear() - age)).getTime()).toLocaleDateString();

        let height = depth ? Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) + "%" : "80%";
        let heightInPx = 250 * (parseInt(height.split('%')[0]) / 100);
        let newMember = {
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
            "top": heightInPx * depth,
            "left": this.family.filter(member => member.depth == depth).length * 500
        }
        this.family.push(newMember);

        this.save('add', null, newMember);

        return newMember;
    }
    editMember = (id, key, newValue) => {
        this.family.find(member => member.id == id)[key] = newValue;
        this.save('edit', id, key, newValue);
    }
    removeMember(id) {
        let lastVersion = this.family;
        if (lastVersion.find(member => member.id == id).with) { lastVersion.find(partner => partner.with == id).with = null; }
        let newVersion = lastVersion.filter(member => member.id != id);
        this.family = newVersion;
        this.save('del', id);
    }
    escapeHTML = (str) => { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
    save = async(method, id = null, key = null, newValue = null) => { return (method ? (await fetch('./api/save', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }, method: "POST", body: JSON.stringify({ method: method, id: id, key: key, newvalue: newValue }) }).then(res => res.json())) : { completed: false, message: 'No method was specified' }) }

}