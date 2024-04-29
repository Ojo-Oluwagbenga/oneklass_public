let school_code = 'OAU'

function loadLiker_downloader(){


  $('.downl_like').click(function(){
    let likeid = $(this).attr("id");
    let data = sessionStorage.getItem("apk_liker");
    if (data){
      data = JSON.parse(data);
      if (data['likings'][likeid]){
        $(this).find("span").css("font-weight", 'bold')
        return
      }
    }
    let action = 'likes';
    if (likeid.split("_")[0] == "downloadid"){
      action = "downloads";
    }
    axios({
        method: 'POST',
        url: window.location.origin +"/api/apkdownloader/download_like",
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            "X-CSRFToken" : $("input[name='csrfmiddlewaretoken']").val()
        },
        data: {
          school_code:"OAU",
          version_code:likeid.split("_")[1],
          action:action,
        }
    }).then(response => {
        console.log("resp", response)
        if (response.data.passed){
          const tt = $(this).find("span").text()
          let val = Number.parseInt(tt) + 1
          $(this).find("span").text(val).css("font-weight", 'bold')
          if (!data){
            data = {
              likings:{
              }
            }
          }
          console.log("data", data)
          data['likings'][likeid] = true;
          sessionStorage.setItem("apk_liker", JSON.stringify(data))
          if (likeid.split("_")[0] == "downloadid"){
            window.location.href = window.location.origin + `/static/downloadapk/versions/${school_code}/OneKlass_${likeid.split("_")[1]}.apk`
          }


        }

    }).catch(error => {
        console.log(error);
    })
  })
}


function load_apks(){
  axios({
      method: 'POST',
      url: window.location.origin +"/api/apkdownloader/fetch_school_all_data",
      headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          "X-CSRFToken" : $("input[name='csrfmiddlewaretoken']").val()
      },
      data: {
        school_code:"OAU"
      }
  }).then(response => {
      console.log(response)
      let releases = response.data.apk_data_dict.releases;
      let cdata = sessionStorage.getItem("apk_liker");
      if (cdata){
        cdata = JSON.parse(cdata);
      }else {
        cdata = {}
      }

      let date = new Date(0)
      let code = '';
      Object.keys(releases).map(version=>{
        let vdata = releases[version];
        let ndate = new Date (vdata['release_date'])
        if (ndate > date){
          console.log("vdata", vdata)
          date = ndate
          code = vdata.version_code
        }
        let text = `<div class="col-lg-6 col-12 mb-4 mb-lg-0" id="${vdata.version_code}">
            <div class="custom-block d-flex">
                <div class="">
                    <div class="custom-block-icon-wrap">
                        <div class="section-overlay"></div>
                        <a href="detail-page.html" class="custom-block-image-wrap">
                            <img src="../static/general/images/oneklass_logo.png" class="custom-block-image img-fluid" alt="">

                        </a>
                    </div>

                    <div class="mt-2">
                        <a id="vdownloads_${vdata.version_code}" code="${vdata.version_code}" style="display:block; text-align:center" class="vdownloads downloader btn custom-btn">
                            Install
                        </a>
                    </div>
                </div>

                <div class="custom-block-info">
                    <div class="custom-block-top d-flex mb-1">
                        <small class="me-4">
                            <i class="bi-download"></i>
                            ${vdata.filesize}MB
                        </small>

                        <small>Version <span class="badge">${vdata.version_code} on ${new Date(vdata.release_date).toLocaleString()}</span></small>
                    </div>

                    <h5 class="mb-2">
                        <a href="detail-page.html">
                            ${vdata.name}
                        </a>
                    </h5>

                    <p class="mb-0">${vdata.release_text}</p>

                    <div class="custom-block-bottom justify-content-between mt-3">
                        <a id="likerid_${vdata.version_code}" class="downl_like liker bi-heart me-1">
                            <span>${vdata.likes}</span>
                        </a>

                        <a id="downloadid_${vdata.version_code}" class="downl_like downloader bi-download" style="margin-left:10px">
                            <span style="font-weight:${cdata["likerid_"+vdata.version_code] ? "bold":"normal"}">${vdata.downloads}</span>
                        </a>
                    </div>
                </div>

            </div>
        </div>`;

        $("#recent_releases").prepend(text)

      })
      loadLiker_downloader();
      $("#d_latest").click(()=>{
          axios({
              method: 'POST',
              url: window.location.origin +"/api/apkdownloader/download_like",
              headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache',
                  "X-CSRFToken" : $("input[name='csrfmiddlewaretoken']").val()
              },
              data: {
                school_code:"OAU",
                version_code:code,
                action:'downloads',
              }
          }).then(response => {
              console.log("resp", response)
              if (response.data.passed){
                window.location.href = window.location.origin + `/static/downloadapk/versions/${school_code}/OneKlass_${code}.apk`

              }

          }).catch(error => {
              console.log(error);
          })
      })
      $(".vdownloads").click(function(){
          let code = $(this).attr('code');
          console.log("code", code);
          axios({
              method: 'POST',
              url: window.location.origin +"/api/apkdownloader/download_like",
              headers: {
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache',
                  "X-CSRFToken" : $("input[name='csrfmiddlewaretoken']").val()
              },
              data: {
                school_code:"OAU",
                version_code:code,
                action:'downloads',
              }
          }).then(response => {
              console.log("resp", response)
              if (response.data.passed){
                window.location.href = window.location.origin + `/static/downloadapk/versions/${school_code}/OneKlass_${code}.apk`

              }

          }).catch(error => {
              console.log(error);
          })
      })
  }).catch(error => {
      console.log(error);
  })
}

load_apks();
