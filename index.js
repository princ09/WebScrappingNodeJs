const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;

const movies = ["https://www.imdb.com/title/tt3371366/?ref_=nv_sr_srsg_0",
                "https://www.imdb.com/title/tt6751668/?ref_=hm_fanfav_tt_1_pd_fp1",
                "https://www.imdb.com/title/tt7286456/?ref_=hm_fanfav_tt_2_pd_fp1",
                "https://www.imdb.com/title/tt8228288/?ref_=hm_fanfav_tt_5_pd_fp1",
                "https://www.imdb.com/title/tt4154796/?ref_=hm_fanfav_tt_11_pd_fp1",
                "https://www.imdb.com/title/tt1375666/?ref_=hm_fanfav_tt_13_pd_fp1",
                "https://www.imdb.com/title/tt9827854/?ref_=hm_fanfav_tt_15_pd_fp1",
                "https://www.imdb.com/title/tt0468569/?ref_=hm_fanfav_tt_18_pd_fp1"
];

(async () => {
    let imdbData = []
    for(let movie of movies){
        const response = await request({
            uri:movie,
            headers:{
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7"
            },
            gzip:true
        });
        let $ = cheerio.load(response)
        let title = $("div[class='title_wrapper'] > h1").text().trim()
        let rating = $("div[class='ratingValue'] > strong > span").text()
        let summary = $("div[class='summary_text']").text().trim()
        let releaseDate = $("a[title='See more release dates']").text().trim()
    
        imdbData.push({
            title,rating,summary,releaseDate,
        });
    }
    const j2cp = new json2csv()
    const csv = j2cp.parse(imdbData);

    fs.writeFileSync("./imdb.csv",csv,"utf-8")
}
)();
