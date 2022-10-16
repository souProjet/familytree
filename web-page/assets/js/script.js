utils = new Utils();
member = new Member();

function removeMemberFocusElements() {
    let memberActive = document.querySelector('.member.active');
    if (memberActive) {
        memberActive.querySelector('.context-menu').classList.add('hide');
        memberActive.querySelector('.add-partner') ? memberActive.querySelector('.add-partner').classList.add('hide') : null;
        memberActive.querySelector('.add-child').classList.add('hide');

        setTimeout(() => {
            memberActive.classList.remove('active');
            memberActive.querySelector('.context-menu').remove();
            memberActive.querySelector('.add-partner') ? memberActive.querySelector('.add-partner').remove() : null;
            memberActive.querySelector('.add-child').remove();

        }, 20);
    }
}
async function memberClicked(e, memberHTML) {
    e.preventDefault();
    e.stopPropagation();
    removeMemberFocusElements();
    let memberJSON = await member.getMember(memberHTML.id.split('-')[1]);
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
        ${!memberJSON.member.with ? `
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
        </svg>`:``}

        <svg class="add-child hide" width="30px" height="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 328.5 328.5" style="enable-background:new 0 0 328.5 328.5;" xml:space="preserve">
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
        </svg>
        `;
    memberHTML.classList.add('active');
    setTimeout(() => {
        memberHTML.querySelector('.context-menu').classList.remove('hide')
        memberHTML.querySelector('.add-partner') ? memberHTML.querySelector('.add-partner').classList.remove('hide') : null;
        memberHTML.querySelector('.add-child').classList.remove('hide');
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
    setTimeout(async() => {
        await member.removeMember(memberHTMLId);
        memberHTML.remove();
        reComputePartnerLink();
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

            document.querySelector('#m-'+memberHTMLId).parentNode.innerHTML+=`<span class="partner-link hide" id="l-${memberHTMLId}-${createMemberReturn.newmember.id}" style="width:${boundingRectB.x - boundingRectA.x}px; left:${boundingRectA.left+boundingRectA.width/(4/3)}px;"><span>`;
            setTimeout(() => {
                let partnerLink = document.querySelector('.partner-link.hide');
                partnerLink.classList.remove('hide')
                setTimeout(() => {
                    partnerLink.style.transition= "none";
                }, 200);
            }, 10);
        }
    }
}

function reComputePartnerLink(){
    document.querySelectorAll('.partner-link').forEach(link => {
        let id = link.id.split("-")[1];
        let parnerId = link.id.split("-")[2];
        let boundingRectA = document.querySelector('#m-'+id).getBoundingClientRect();
        let boundingRectB = document.querySelector('#m-'+parnerId).getBoundingClientRect();
        link.style.width = (boundingRectB.x - boundingRectA.x)+ "px";
        link.style.left = boundingRectA.left+boundingRectA.width/2 +"px";
    }); 
}

window.addEventListener('resize', reComputePartnerLink);