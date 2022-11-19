class Data {
    constructor() {
        this.family = [];
        this.deltaPosition = { left: 0, top: 0 };
        this.token = localStorage.getItem('token')
        if (!this.token) {
            this.token = this.createID(10);
            localStorage.setItem('token', this.token);
            (async() => {
                let firstMember = await this.createMember();
                if (firstMember) {
                    let partnerOfFirstMember = await this.createMember([], firstMember.id);
                    if (partnerOfFirstMember) {
                        canvas.build(this.family)
                    }
                }

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
        parentsID.forEach(parentID => this.family.find(parent => parent.id == parentID).children.push(newMemberID))
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

        //let nationality = (await fetch(`https://api.nationalize.io?name=${name}`).then(res => res.json())).country[0].country_id;
        let nationality = "FR";

        //let age = inCoupleWith ? (this.family.find(p => p.id == inCoupleWith).age + Math.floor(Math.random() * 20) + (-10)) : (await fetch(`https://api.agify.io?name=${name}&country_id=${nationality}`).then(res => res.json())).age || Math.floor(Math.random() * 70 - 10) + 10;
        let age = inCoupleWith ? (this.family.find(p => p.id == inCoupleWith).age + Math.floor(Math.random() * 20) + (-10)) : Math.floor(Math.random() * 100);

        let birthday = new Date(Math.random() * (new Date('01-01-' + ((new Date()).getUTCFullYear() - age)).getTime() - new Date('12-31-' + ((new Date()).getUTCFullYear() - age)).getTime()) + new Date('12-31-' + ((new Date()).getUTCFullYear() - age)).getTime()).toLocaleDateString();

        let height = 250 * (parseInt(depth ? Math.floor(80 - Math.log10(depth * (depth * 10)) * 15) : 80) / 100);

        let top = depth ? (height * depth + 100 * depth) : 0;

        let children = inCoupleWith ? this.family.find(p => p.id == inCoupleWith).children : [];

        let newMember = {
            "id": newMemberID,
            "name": name,
            "birthday": birthday,
            "age": age,
            "children": children,
            "with": inCoupleWith,
            "picture": false,
            "gender": gender,
            "nationality": nationality,
            "depth": depth,
            "height": height,
            "top": top,
            "left": 0
        }
        this.family.push(newMember);
        this.save('add', null, newMember, parentsID);

        this.adjustPositioning();

        return newMember;
    }
    editMember = (id, key, newValue) => {
        this.family.find(member => member.id == id)[key] = newValue;
        this.adjustPositioning();
        this.save('edit', id, key, newValue);
    }
    removeMember(id) {
        let lastVersion = this.family;
        if (lastVersion.find(member => member.id == id).with) { lastVersion.find(partner => partner.with == id).with = null; }
        for (let i = 0; i < lastVersion.length; i++) {
            lastVersion[i].children = lastVersion[i].children.filter(child => child != id);
        }
        let newVersion = lastVersion.filter(member => member.id != id);
        this.family = newVersion;
        this.adjustPositioning();

        this.save('del', id);
    }
    adjustPositioning() {
        let maxDepth = 0;
        this.family.forEach(member => member.depth > maxDepth ? maxDepth++ : null);

        let newFamilyTree = [...this.family]
        let repositioningElements = [];
        for (let i = 0; i <= maxDepth; i++) {
            if (i == 0) {
                let base = this.family.filter(member => member.depth == 0);
                for (let n = 0; n < base.length; n++) {
                    let left = (window.innerWidth / 2 - base[n].height / 2) - ((n ? -1 : 1) * (base[n].height + 100));
                    newFamilyTree.find(member => member.id == base[n].id).left = left;
                    repositioningElements.push({
                        id: base[n].id,
                        value: left
                    })
                }
            } else {

                let children = this.family.filter(member => member.depth == i);
                let left = 0;
                for (let n = 0; n < children.length; n++) {
                    let top = children[n].depth ? (children[n].height * children[n].depth + 100 * children[n].depth) : 0;
                    newFamilyTree.find(member => member.id == children[n].id).top = top
                }
                let childrenWithoutCouple = this.family.filter(member => member.depth == i).filter(member => this.family.find(parent => parent.children.indexOf(member.id) != -1));
                childrenWithoutCouple.sort((a, b) => (this.family.find(member => member.children.indexOf(a.id) != -1).left - this.family.find(member => member.children.indexOf(b.id) != -1).left))
                let middle = Math.ceil(children.length / 2) - 1;
                let counter = 0;
                for (let n = 0; n < childrenWithoutCouple.length; n++) {
                    // let parents = this.family.filter(parent => parent.children.indexOf(childrenWithoutCouple[n].id) != -1);
                    // let haveTwoParents = parents.length == 2 ? true : false
                    // let firstParent = haveTwoParents ? ((parents[0].left) < (parents[1].left) ? parents[0] : parents[1]) : parents[0]
                    // let secondeParent = haveTwoParents ? ((parents[0].left + data.deltaPosition.left) > (parents[1].left + data.deltaPosition.left) ? parents[0] : parents[1]) : undefined;
                    //let relativeCenter = haveTwoParents ? ((firstParent.left) + firstParent.height + ((secondeParent.left) - ((firstParent.left) + firstParent.height)) / 2) : ((firstParent.left) + parents[0].height / 2)
                    let relativeCenter = window.innerWidth / 2;
                    left = (relativeCenter - childrenWithoutCouple[n].height / 2) - (children.length % 2 ? 0 : 150) + (counter >= middle ? 1 : -1) * Math.abs(((counter - middle) * 300))

                    newFamilyTree.find(member => member.id == childrenWithoutCouple[n].id).left = left

                    repositioningElements.push({
                        id: childrenWithoutCouple[n].id,
                        value: left
                    })
                    counter++;

                    if (childrenWithoutCouple[n].with) {
                        left = (relativeCenter - childrenWithoutCouple[n].height / 2) - (children.length % 2 ? 0 : 150) + (counter >= middle ? 1 : -1) * Math.abs(((counter - middle) * 300))
                        newFamilyTree.find(member => member.id == childrenWithoutCouple[n].with).left = left
                        repositioningElements.push({
                            id: childrenWithoutCouple[n].with,
                            value: left
                        })
                        counter++;
                    }
                }
            }
        }
        this.family = newFamilyTree;
        this.save('positioning', null, repositioningElements)

    }
    escapeHTML = (str) => { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
    save = async(method, id = null, key = null, newValue = null) => { return (method ? (await fetch('./api/save', { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }, method: "POST", body: JSON.stringify({ method: method, id: id, key: key, newvalue: newValue }) }).then(res => res.json())) : { completed: false, message: 'No method was specified' }) }

}