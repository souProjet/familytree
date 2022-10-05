export async function main(request: any, webhook: any) {
    let userAgent = request.headers.get("User-Agent");
    let ip = request.headers.get("X-Forwarded-For") ? request.headers.get("X-Forwarded-For").split(',')[0].trim() : null;
    let pays = request.headers.get("CF-IPCountry")

    const listPays = {
        "FR": "France",
        "DE": "Allemagne",
        "IT": "Italie",
        "ES": "Espagne",
        "UK": "Royaume-Uni",
        "US": "États-Unis",
        "NL": "Pays-Bas",
        "BE": "Belgique",
        "DK": "Danemark",
        "FI": "Finlande",
        "SE": "Suède",
        "NO": "Norvège",
        "JP": "Japon",
        "CN": "Chine",
        "KR": "Corée du Sud",
        "IN": "Inde",
        "BR": "Brésil",
        "MX": "Mexique",
        "AR": "Argentine",
        "CL": "Chili",
        "CO": "Colombie",
        "RU": "Russie",
        "TR": "Turquie",
        "EG": "Egypte",
        "IR": "Iran",
        "IQ": "Irak",
        "UA": "Ukraine",
        "IL": "Israël",
        "SA": "Arabie saoudite",
        "SG": "Singapour",
        "MY": "Malaisie",
        "CA": "Canada",
        "GB": "Royaume-Uni",
        "AU": "Australie",
        "DZ": "Algérie",
        "IE": "Irlande",
        "AT": "Autriche",
        "ZA": "Afrique du Sud",
        "NG": "Nigéria",
        "VN": "Vietnam",
    }
    const listNavigateur = {
        "Chrome": "Google Chrome",
        "Firefox": "Mozilla Firefox",
        "Safari": "Apple Safari",
        "Opera": "Opera",
        "Edge": "Microsoft Edge",
        "IE": "Microsoft Internet Explorer",
        "Trident": "Microsoft Internet Explorer",
        "Other": "Autre",
    }
    pays = pays ? listPays[pays] || pays : null;
    let navigateur = listNavigateur[userAgent.split(" ")[userAgent.split(" ").length - 1].split("/")[0]] || userAgent.split(" ")[userAgent.split(" ").length - 1].split("/")[0];
    let os = userAgent.split("(")[1].split(")")[0].split(";")[1].trim();

    if (ip != undefined) {
        // webhook.send({
        //     "content": `connexion à **familytree**`+(pays ? (` en **${pays}**`) : ``)+` depuis **${ip}** via **${navigateur}** sous **${os}**`,
        // });
    }
    let temp = Deno.readTextFileSync("./web-page/index.html");

    return temp;

}
