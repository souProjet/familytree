utils = new Utils();
member = new Member();

let partnerFocused;

async function removeMemberFocusElements() {
    let memberActive = document.querySelector('.member.active');

    if (memberActive) {
        memberActive.querySelector('.context-menu').classList.add('hide');
        memberActive.querySelector('.add-partner') ? memberActive.querySelector('.add-partner').classList.add('hide') : null;
        memberActive.querySelector('.add-child') ? memberActive.querySelector('.add-child').classList.add('hide') : null;

        let memberJSON = await member.getMember(memberActive.id.split('-')[1]);
        let partnerLink = null;
        if (memberJSON.member.with && memberActive.id.split('-')[1] !== partnerFocused) {
            partnerLinkHtml = (document.querySelector('#l-' + memberActive.id.split('-')[1] + '-' + memberJSON.member.with) || document.querySelector('#l-' + memberJSON.member.with + '-' + memberActive.id.split('-')[1]))
            partnerLinkHtml ? partnerLinkHtml.style.backgroundColor = "#bde582" : null;
            partnerLinkHtml ? partnerLinkHtml.querySelector('.add-child').classList.add('hide') : null;
        }
        setTimeout(() => {
            memberActive.classList.remove('active');
            memberActive.querySelector('.context-menu').remove();
            memberActive.querySelector('.add-partner') ? memberActive.querySelector('.add-partner').remove() : null;
            memberActive.querySelector('.add-child') ? memberActive.querySelector('.add-child').remove() : null;
            memberActive.querySelector('.picture').style.border = "solid 10px #bde582";
            if (memberJSON.member.with && memberActive.id.split('-')[1] !== partnerFocused) {
                partnerLinkHtml ? partnerLinkHtml.querySelector('.add-child').remove() : null;
            }
        }, 20);
    }
}
async function memberClicked(e, memberHTML) {
    e.preventDefault();
    e.stopPropagation();
    removeMemberFocusElements();
    let memberJSON = await member.getMember(memberHTML.id.split('-')[1]);
    memberHTML.querySelector('.picture').style.border = "solid 10px #79a932";
    if (memberJSON.member.with) {
        partnerFocused = memberJSON.member.with;
        (document.querySelector('#l-' + memberHTML.id.split('-')[1] + '-' + memberJSON.member.with) || document.querySelector('#l-' + memberJSON.member.with + '-' + memberHTML.id.split('-')[1])).style.backgroundColor = "#79a932";
    }
    memberHTML.innerHTML += `
        <div class="context-menu hide">
            <svg onclick="removeMember(this.parentNode.parentNode)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 348.333 348.334" style="enable-background:new 0 0 348.333 348.334;" xml:space="preserve">
                <g fill="red">
                    <path d="M336.559,68.611L231.016,174.165l105.543,105.549c15.699,15.705,15.699,41.145,0,56.85
                        c-7.844,7.844-18.128,11.769-28.407,11.769c-10.296,0-20.581-3.919-28.419-11.769L174.167,231.003L68.609,336.563
                        c-7.843,7.844-18.128,11.769-28.416,11.769c-10.285,0-20.563-3.919-28.413-11.769c-15.699-15.698-15.699-41.139,0-56.85
                        l105.54-105.549L11.774,68.611c-15.699-15.699-15.699-41.145,0-56.844c15.696-15.687,41.127-15.687,56.829,0l105.563,105.554
                        L279.721,11.767c15.705-15.687,41.139-15.687,56.832,0C352.258,27.466,352.258,52.912,336.559,68.611z"/>
                </g>
            </svg>
            <svg onclick="uploadPicture(this.parentNode.parentNode)" width="25px" height="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 384.97 384.97" style="enable-background:new 0 0 384.97 384.97;" xml:space="preserve">
            <g>
                <g id="Upload">
                    <path d="M372.939,264.641c-6.641,0-12.03,5.39-12.03,12.03v84.212H24.061v-84.212c0-6.641-5.39-12.03-12.03-12.03
                        S0,270.031,0,276.671v96.242c0,6.641,5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03v-96.242
                        C384.97,270.019,379.58,264.641,372.939,264.641z"/>
                    <path d="M117.067,103.507l63.46-62.558v235.71c0,6.641,5.438,12.03,12.151,12.03c6.713,0,12.151-5.39,12.151-12.03V40.95
                        l63.46,62.558c4.74,4.704,12.439,4.704,17.179,0c4.74-4.704,4.752-12.319,0-17.011l-84.2-82.997
                        c-4.692-4.656-12.584-4.608-17.191,0L99.888,86.496c-4.752,4.704-4.74,12.319,0,17.011
                        C104.628,108.211,112.327,108.211,117.067,103.507z"/>
                </g>
            </g>
            </svg>
        </div>
        ${!memberJSON.member.with ?`
        <svg onclick="addPartner(this.parentNode)" width="25px" height="25px" class="add-partner hide" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 611.997 611.997" style="enable-background:new 0 0 611.997 611.997;" xml:space="preserve">
            <g fill="rgba(255, 23, 39, .9)">
                <g>
                    <path d="M549.255,384.017h-50.692v-50.694c0-21.132-17.134-38.264-38.262-38.264c-21.138,0-38.266,17.132-38.266,38.264v50.694
                        h-50.697c-21.13,0-38.262,17.132-38.262,38.264c0,21.134,17.134,38.264,38.262,38.264h50.697v50.697
                        c0,21.13,17.13,38.264,38.266,38.264c21.13,0,38.262-17.134,38.262-38.264v-50.697h50.692c21.138,0,38.262-17.13,38.262-38.264
                        C587.519,401.151,570.394,384.017,549.255,384.017z"/>
                    <path d="M383.77,498.809h-12.432c-42.198,0-76.526-34.33-76.526-76.528s34.328-76.528,76.526-76.528h12.432v-12.43
                        c0-42.198,34.33-76.528,76.53-76.528c42.198,0,76.526,34.33,76.526,76.528v12.43h12.428c5.073,0,10.028,0.508,14.827,1.454
                        c66.899-77.109,63.762-194.319-9.515-267.606c-37.102-37.1-86.429-57.533-138.896-57.533c-39.544,0-77.476,11.685-109.659,33.39
                        c-32.185-21.705-70.117-33.39-109.659-33.39c-52.464,0-101.791,20.433-138.896,57.535
                        c-76.609,76.617-76.609,201.284,0.002,277.904l215.831,215.829c2.226,2.222,4.583,4.463,7.009,6.664
                        c7.293,6.619,16.501,9.93,25.716,9.93c9.198,0,18.396-3.301,25.684-9.903c2.448-2.216,4.826-4.477,7.069-6.72l46.584-46.582
                        c-1.033-5.002-1.577-10.181-1.577-15.482v-12.432H383.77z"/>
                </g>
            </g>
        </svg>

        <svg onclick="addChild(this.parentNode)" class="add-child hide" width="30px" height="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 328.5 328.5" style="enable-background:new 0 0 328.5 328.5;" xml:space="preserve">
            <g fill="#2682ff">
                <g>
                    <polygon points="96.333,150.918 96.333,135.918 55.667,135.918 55.667,95.251 40.667,95.251 40.667,135.918 0,135.918 0,150.918 
                        40.667,150.918 40.667,191.583 55.667,191.583 55.667,150.918 		"/>
                    <path d="M259.383,185.941H145.858c-38.111,0-69.117,31.006-69.117,69.117v39.928H328.5v-39.928
                        C328.5,216.948,297.494,185.941,259.383,185.941z M313.5,279.987H91.741v-24.928c0-29.84,24.276-54.117,54.117-54.117h113.524
                        c29.84,0,54.117,24.277,54.117,54.117L313.5,279.987L313.5,279.987z"/>
                    <path d="M202.621,178.84c40.066,0,72.662-32.597,72.662-72.663s-32.596-72.663-72.662-72.663s-72.663,32.596-72.663,72.663
                        S162.555,178.84,202.621,178.84z M202.621,48.515c31.795,0,57.662,25.867,57.662,57.663s-25.867,57.663-57.662,57.663
                        c-31.796,0-57.663-25.868-57.663-57.663S170.825,48.515,202.621,48.515z"/>
                </g>
            </g>
        </svg>`:``}
        `;

    let partnerLinkHtml = undefined;
    if(memberJSON.member.with){
        partnerLinkHtml = (document.querySelector('#l-' + memberHTML.id.split('-')[1] + '-' + memberJSON.member.with) || document.querySelector('#l-' + memberJSON.member.with + '-' + memberHTML.id.split('-')[1]))
        partnerLinkHtml.innerHTML+=`
        <svg onclick="addChild(document.querySelector('#m-${memberHTML.id.split('-')[1]}'))" class="add-child hide" width="35px" height="35px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 328.5 328.5" style="enable-background:new 0 0 328.5 328.5;" xml:space="preserve">
            <g fill="#2682ff">
                <g>
                    <polygon points="96.333,150.918 96.333,135.918 55.667,135.918 55.667,95.251 40.667,95.251 40.667,135.918 0,135.918 0,150.918 
                        40.667,150.918 40.667,191.583 55.667,191.583 55.667,150.918 		"/>
                    <path d="M259.383,185.941H145.858c-38.111,0-69.117,31.006-69.117,69.117v39.928H328.5v-39.928
                        C328.5,216.948,297.494,185.941,259.383,185.941z M313.5,279.987H91.741v-24.928c0-29.84,24.276-54.117,54.117-54.117h113.524
                        c29.84,0,54.117,24.277,54.117,54.117L313.5,279.987L313.5,279.987z"/>
                    <path d="M202.621,178.84c40.066,0,72.662-32.597,72.662-72.663s-32.596-72.663-72.662-72.663s-72.663,32.596-72.663,72.663
                        S162.555,178.84,202.621,178.84z M202.621,48.515c31.795,0,57.662,25.867,57.662,57.663s-25.867,57.663-57.662,57.663
                        c-31.796,0-57.663-25.868-57.663-57.663S170.825,48.515,202.621,48.515z"/>
                </g>
            </g>
        </svg>`;
    }
    memberHTML.classList.add('active');
    setTimeout(() => {
        memberHTML.querySelector('.context-menu').classList.remove('hide')
        memberHTML.querySelector('.add-partner') ? memberHTML.querySelector('.add-partner').classList.remove('hide') : null;
        memberHTML.querySelector('.add-child') ? memberHTML.querySelector('.add-child').classList.remove('hide') : null;
        partnerLinkHtml ? partnerLinkHtml.querySelector('.add-child').classList.remove('hide') : null;
    }, 10)
}

async function removeMember(memberHTML) {
    memberHTML.classList.add('hide');
    let memberHTMLId = memberHTML.id.split('-')[1];
    let memberJSON = await member.getMember(memberHTMLId);
    if(memberJSON.member.with){
        let removePartnerReturn = await member.removePartner(memberJSON.member.with, memberHTMLId);
        if(removePartnerReturn.completed){
            (document.querySelector('#l-'+memberHTMLId+'-'+memberJSON.member.with) || document.querySelector('#l-'+memberJSON.member.with+'-'+memberHTMLId)).remove();
        }
    }
    document.querySelector('[id^="l-'+memberHTMLId+'"]') ? document.querySelector('[id^="l-'+memberHTMLId+'"]').remove() : null;

    setTimeout(async() => {
        await member.removeMember(memberHTMLId);
        memberHTML.remove();
        reComputeLink();
    }, 40);
}

document.querySelector('.container').addEventListener('click', () => { removeMemberFocusElements() });

async function addPartner(memberHTML){
    let memberHTMLId = memberHTML.id.split('-')[1];
    let createMemberReturn = await member.createMember(memberHTMLId);
    if(createMemberReturn.completed){
        let addPartnerReturn = await member.addPartner(memberHTMLId, createMemberReturn.newmember.id);
        if(addPartnerReturn.completed){
            
            let boundingRectA = document.querySelector('#m-'+memberHTMLId).getBoundingClientRect();
            let boundingRectB = document.querySelector('#m-'+createMemberReturn.newmember.id).getBoundingClientRect();

            document.querySelector('#m-'+memberHTMLId).parentNode.innerHTML+=`
                <span class="partner-link horizontal hide" id="l-${memberHTMLId}-${createMemberReturn.newmember.id}" style="width:${boundingRectB.x - boundingRectA.x}px; left:${boundingRectA.left+boundingRectA.width/(4/3)}px;">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 502 502" style="enable-background:new 0 0 502 502;" xml:space="preserve" width="40px" height="40px">
                        <g>
                            <g>
                                <path style="fill:#FF1D25;" d="M370.994,49.998c-61.509,0-112.296,45.894-119.994,105.306    c-7.698-59.412-58.485-105.306-119.994-105.306C64.176,49.998,10,104.174,10,171.004s80.283,135.528,116.45,166.574    C160.239,366.582,251,452.002,251,452.002s90.761-85.42,124.55-114.424C411.717,306.532,492,237.834,492,171.004    S437.824,49.998,370.994,49.998z"/>
                                <path d="M251,462.002c-2.464,0-4.928-0.906-6.854-2.718c-0.906-0.853-90.981-85.595-124.21-114.119l-0.348-0.299    C80.771,311.548,0,242.216,0,171.004C0,98.767,58.769,39.998,131.006,39.998c52.959,0,99.547,31.914,119.994,78.382    c20.446-46.468,67.035-78.382,119.994-78.382C443.231,39.998,502,98.767,502,171.004c0,71.211-80.771,140.543-119.588,173.862    l-0.348,0.299c-33.231,28.525-123.304,113.266-124.21,114.119C255.928,461.096,253.464,462.002,251,462.002z M131.006,59.998    C69.797,59.998,20,109.795,20,171.004c0,62.021,78.917,129.761,112.615,158.687l0.348,0.299    c28.14,24.155,96.205,87.815,118.037,108.294c21.832-20.479,89.897-84.139,118.037-108.294l0.348-0.299    C403.083,300.765,482,233.025,482,171.004c0-61.209-49.797-111.006-111.006-111.006c-55.619,0-102.941,41.525-110.077,96.591    c-0.646,4.984-4.891,8.715-9.917,8.715s-9.271-3.73-9.917-8.715C233.948,101.523,186.625,59.998,131.006,59.998z"/>
                            </g>
                            <g>
                                <path d="M252.008,412.021c-2.445,0-4.895-0.891-6.823-2.691c-26.934-25.15-75.469-70.218-97.909-89.48l-0.304-0.261    c-3.771-3.237-8.046-6.907-12.652-10.936c-4.157-3.636-4.58-9.954-0.943-14.11c3.635-4.158,9.953-4.58,14.11-0.943    c4.536,3.967,8.773,7.604,12.512,10.813l0.304,0.261c21.578,18.523,65.492,59.187,98.532,90.038    c4.037,3.77,4.253,10.097,0.484,14.134C257.35,410.955,254.682,412.021,252.008,412.021z"/>
                            </g>
                            <g>
                                <path d="M113.283,285.803c-2.51,0-5.021-0.938-6.964-2.825c-6.611-6.417-12.866-12.804-18.592-18.982    c-3.754-4.05-3.514-10.377,0.537-14.132c4.05-3.754,10.377-3.514,14.132,0.537c5.488,5.921,11.495,12.053,17.854,18.227    c3.963,3.847,4.057,10.178,0.21,14.141C118.498,284.788,115.892,285.803,113.283,285.803z"/>
                            </g>
                        </g>
                    </svg>
                <span>`;
            setTimeout(() => {
                let partnerLink = document.querySelector('.partner-link.hide');
                partnerLink.classList.remove('hide')
                setTimeout(() => {
                    partnerLink.style.transition= "none";
                    reComputeLink();
                }, 200);
            }, 10);
        }
    }
}

async function addChild(memberHTML){
    let memberHTMLId = memberHTML.id.split('-')[1];
    let memberJSON = await member.getMember(memberHTMLId);
    if(memberJSON.completed){
        let createMemberReturn = await member.createMember(false, [memberJSON.member.id, memberJSON.member.with ? memberJSON.member.with : null]);
        if(createMemberReturn.completed){
            let weight = 10;
            document.querySelector('#m-'+createMemberReturn.newmember.id).parentNode.innerHTML+=`
            <svg class="partner-link-svg" id="l-${createMemberReturn.newmember.id}-${memberHTMLId}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;display:block;" id="svg" viewBox="0 0 0 0" preserveAspectRatio="xMidYMid meet">
                <path style="stroke-width: ${weight}px;stroke: #bde582;stroke-linecap: round;fill: none;" id="curve" d="" />
            </svg>
            `;
            reComputeLink();
        }
    }
}

function reComputeLink(){
    document.querySelectorAll('.partner-link').forEach(link => {
        let id = link.id.split("-")[1];
        if(link.classList.contains('horizontal')){
            let parnerId = link.id.split("-")[2];
            let boundingRectA = document.querySelector('#m-'+id).getBoundingClientRect();
            let boundingRectB = document.querySelector('#m-'+parnerId).getBoundingClientRect();
            link.style.width = (boundingRectB.x - boundingRectA.x)+ "px";
            link.style.left = boundingRectA.left+boundingRectA.width/2 +"px";
        }else{
            let parentId = link.id.split("-")[2];
            let boundingRectA = document.querySelector('#m-'+parentId).getBoundingClientRect();
            let boundingRectB = document.querySelector('#m-'+id).getBoundingClientRect();
            let top = boundingRectA.top+boundingRectA.height/2;
            let height = boundingRectB.top-boundingRectB.height/2-10;
            link.style.height = height + "px";
            link.style.top = top+"px";
        }
    }); 

    document.querySelectorAll('.partner-link-svg').forEach(link => {
        let childElement = document.querySelector('#m-'+link.id.split('-')[1]);
        let parentElement = document.querySelector('#m-'+link.id.split("-")[2]);
        let partnerLinkHtml = document.querySelector('.partner-link[id*="'+link.id.split('-')[2]+'"]');
        let partnerSide = partnerLinkHtml ? (partnerLinkHtml.id.split('-')[1] == link.id.split('-')[2] ? 0 : 1) : null;
        let startingPointLeft = parentElement.offsetLeft + (partnerLinkHtml ? partnerLinkHtml.offsetWidth/2 : 0) * (partnerSide ? -1 : 1);
        let startingPointTop = parentElement.offsetTop + parentElement.offsetHeight / (partnerLinkHtml ? 2 : 1);
        if(startingPointLeft < childElement.offsetLeft){
            let weight = 10
            let left = Math.floor(startingPointLeft + (parentElement.offsetWidth/2))-weight;
            let top = Math.floor(startingPointTop)-weight*1.5;
            let height = Math.floor(childElement.offsetTop - top)+weight;
            let width = Math.floor((childElement.offsetLeft + (childElement.offsetWidth/2) - left))+weight;
            link.style.width = width+"px";
            link.style.left = left+"px";
            link.style.top = top+"px";
            link.style.height = height+"px";
            link.setAttribute('viewBox', `0 0 ${width} ${height}`);
            link.querySelector('path').setAttribute('d', `M${width-1-weight},${height-1} C${width-1},${partnerLinkHtml ? height/2 : 0} 0,${height-1} ${weight},0`)
        }else{
            let weight = 10
            let left = Math.floor(childElement.offsetLeft + (childElement.offsetWidth/2))-weight;
            let top = Math.floor(startingPointTop)-weight*1.5;
            let height = Math.floor(childElement.offsetTop - top)+weight;
            let width = Math.floor(startingPointLeft - childElement.offsetLeft)+weight
            link.style.width = width+2*weight+"px";
            link.style.left = left+"px";
            link.style.top = top+"px";
            link.style.height = height+"px";
            link.setAttribute('viewBox', `0 0 ${width} ${height}`);
            link.querySelector('path').setAttribute('d', `M0,${height-1} C0,${partnerLinkHtml ? height/2 : 0} ${width-1},${height-1} ${width-1+weight},0`)
        }
    });
}

window.addEventListener('resize', reComputeLink);

window.addEventListener('load', async() => {
    let createMemberReturn = await member.createMember();
    if(createMemberReturn.completed){
        setTimeout(() => {
            addPartner(document.querySelector('#m-'+createMemberReturn.newmember.id));
        },200);
    }
})