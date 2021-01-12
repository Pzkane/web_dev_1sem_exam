window.addEventListener("load", () => {
  let input = false;

  let credsBlock = document.querySelector(".creds-block");
  let loginBtn = document.getElementById("login-btn");
  loginBtn.addEventListener("click", () => {
    credsBlock.style.display = "block";
    setTimeout(() => {
      credsBlock.classList.add("reveal");
    }, 100);
  });

  let usrLogin = document.getElementById("usr_login");
  let usrPass = document.getElementById("usr_pass");
  let confirmLogin = document.querySelector(".creds-block button");

  usrLogin.addEventListener("input", () => {
    if (usrLogin.value && usrPass.value && !input)
    {
      input = true;
      confirmLogin.style.display = "block";
      setTimeout(() => {
        confirmLogin.style.transform = "scaleY(1)";
      }, 100);
    }
    if (!usrLogin.value || !usrPass.value)
    {
      input = false;
      confirmLogin.style.transform = "scaleY(0)";
      setTimeout(() => {
        confirmLogin.style.display = "none";
      }, 500);
    }
  });
  usrPass.addEventListener("input", () => {
    if (usrLogin.value && usrPass.value && !input)
    {
      input = true;
      confirmLogin.style.display = "block";
      setTimeout(() => {
        confirmLogin.style.transform = "scaleY(1)";
      }, 100);
    }
    if (!usrLogin.value || !usrPass.value)
    {
      input = false;
      confirmLogin.style.transform = "scaleY(0)";
      setTimeout(() => {
        confirmLogin.style.display = "none";
      }, 500);
    }
  });

  confirmLogin.addEventListener("click", () => {
    if (usrLogin.value == CREDENTIALS.login && usrPass.value == CREDENTIALS.pass)
      pass();
    else
      obliterate();
  });

  function obliterate() {
    $("body *").css("display", "none");
    $("#doom").css("display", "block");
    $("#doom").attr("src", "https://cdnb.artstation.com/p/assets/images/images/010/143/107/original/nadezhda-odinokova-explosion-1.gif?1522796555");
    setTimeout(() => {
      $("#doom").css("display", "none");
    }, 3000);
  }

  function pass() {
    document.querySelector(".intro").style.display = "none";
    let controlArticle = document.getElementById("control");
    controlArticle.style.display = "block";

    function wrapText() {
      let textWrapper = document.querySelector("#control p:nth-of-type(1)");
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
  
      anime({
          targets: '.letter',
          opacity: [0,1],
          delay: (el, i) => 20 * (i+1),
          duration: 30,
        })
      _blink('#dash');
    }
    wrapText();

    let mainArticle = document.querySelector("#control article");
    let expandArticleBtn = document.querySelector("#control > div button");
    expandArticleBtn.addEventListener("click", () => {
      expandArticleBtn.style.display = "none";
      mainArticle.style.display = "block";

      // img clearing to satisfy html validation
      if (document.querySelector("#img-container img").getAttribute("src") == "src")
        document.querySelector("#img-container img").style.display = "none";
    });

    let todoApp = document.getElementById("todo");
    let input = document.getElementById("input-task");
    let addTaskBtn = document.getElementById("add-task");
    let todoTasks = [];
    let count = -1;

    addTaskBtn.addEventListener("click", () => {
      if (input.value)
      {
        todoTasks.push({
          id: ++count,
          done: false,
          description: input.value,
        });
        input.value = "";
  
        todoApp.innerHTML = "";
        for (const task of todoTasks) {
          let li = document.createElement("li");
          li.setAttribute("name", "_todo_id_"+task.id)
          let chkBox = document.createElement("input");
          chkBox.setAttribute("type", "checkbox");
          chkBox.addEventListener("change", () => {
            if (chkBox.checked)
            {
              li.classList.add("done");
              task.done = true;
            }
            else
            {
              li.classList.remove("done");
              task.done = false;
            }
          });
  
          li.innerHTML = task.description + " id:" + task.id;
          li.appendChild(chkBox);
          todoApp.appendChild(li);
        }
  
        // set class
        let rows = document.querySelectorAll("li[name*='_todo_id_']");
        for (const row of rows) {
          let idValue = row.getAttribute("name");
          idValue = idValue.match(/[0-9]+/)[0];
          task = todoTasks.find(task => task.id == idValue);
          let box = row.getElementsByTagName("input")[0];
          if (task.done)
          {
            box.checked = true;
            row.classList.add("done");
          }
          else
          {
            box.checked = false;
            row.classList.remove("done");
          }
        }
      }
      else
        alert("Input is empty!");
    });

    let fileUpload = document.getElementById("file-input");
    fileUpload.addEventListener("change", () => {
      if (fileUpload.files && fileUpload.files[0])
      {
        let img = document.querySelector("#img-container img");
        img.style.display = "inline";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        img.src = URL.createObjectURL(fileUpload.files[0]);
        img.onload = () => {
          document.getElementById("color-info-container").style.display = "block";
          let ul = document.querySelector("#color-info-container ul");
          let label = document.querySelector("#color-info-container p");

          ul.innerHTML = "";
          label.className = "";
          img.style.display = "block";
          if (img.width > 500 || img.height > 500)
          {
            label.innerHTML = "Error! Image size is over 500x500px!";
            label.classList.add("error");
            img.style.display = "none";
          }
          else
          {
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            console.log("Width: " + img.width);
            console.log("Height: " + img.height);
            canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
            let colorMap = [];
            for (let x = -img.width; x < img.width; ++x)
              for (let y = -img.height; y < img.height; ++y)
              {
                let pixelData = canvas.getContext("2d").getImageData(x, y, 1, 1).data;
                let rgba = [
                  pixelData[0], //r
                  pixelData[1], //g
                  pixelData[2], //b
                  pixelData[3], //a
                ]

                let exist = false;
                for (const color of colorMap) {
                  if (arraysEqual(color, rgba))
                  {
                    exist = true;
                    break;
                  }
                }
                if (!exist)
                  colorMap.push(rgba);
              }
            console.log(colorMap);

            // create color list
            label.innerHTML = "Number of colors: " + colorMap.length + ". Colors:";
            for (const color of colorMap) {
              let li = document.createElement("li");
              li.style.margin = "40px 0";
              let colorSquare = document.createElement("div");
              colorSquare.classList.add("color-square")
              colorSquare.style.backgroundColor = "rgba("+color[0]+", "+color[1]+", "+color[2]+", "+color[3]+")";
              colorSquare.style.border = "dashed 2px #149414";
              let textNode = document.createTextNode(`(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
              li.appendChild(colorSquare);
              li.appendChild(textNode);
              ul.appendChild(li);
            }
          }
        };
      }
    });

    // from validation
    $("#submit").on("click", () => {
      let fname = $("#firstname").val();
      let lname = $("#lastname").val();
      let email = $("#email").val();
      let submitIsValid = true;
      const LENGTH = 24;
      $("#fname-error").text("");
      $("#lname-error").text("");
      $("#email-error").text("");


      if (!validLength(fname, LENGTH))
      {
        $("#fname-error").text(`Input cannot be more than ${LENGTH} characters!`);
        submitIsValid = false;
      }
      if (!validCommonNoun(fname))
      {
        $("#fname-error").text("Input is not a name - only accepts letters!");
        submitIsValid = false;
      }
      if (!fname.length)
      {
        $("#fname-error").text("Field cannot be empty!");
        submitIsValid = false;
      }

      if (!validLength(lname, LENGTH + 4))
      {
        $("#lname-error").text(`Input cannot be more than ${LENGTH + 4} characters!`);
        submitIsValid = false;
      }
      if (!validCommonNoun(lname))
      {
        $("#lname-error").text("Input is not a name - only accepts letters!");
        submitIsValid = false;
      }
      if (!lname.length)
      {
        $("#lname-error").text("Field cannot be empty!");
        submitIsValid = false;
      }

      if (!validEmail(email))
      {
        $("#email-error").text(`Input is not an email - format : xxx@xxx.xxx!`);
        submitIsValid = false;
      }
      if (!email.length)
      {
        $("#email-error").text("Field cannot be empty!");
        submitIsValid = false;
      }

      if (submitIsValid)
      {
        $("#firstname").val(fname.toLowerCase());
        $("#lastname").val(lname.toLowerCase());
        $("#email").val(email.toLowerCase());
        $("form")[0].submit();
      }
    });
  }
});

function _blink(selector, delay = 500, duration = 500) {
  anime({
    targets: selector,
    opacity: [0,1],
    delay: (el, i) => delay * (i+1),
    duration: duration,
    loop: true,
  })
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function validLength(string, maxLength) {
  if (string.length > maxLength)
    return false;
  return true;
}

function validCommonNoun(string) {
  if (string)
    if (string.match(/^[a-zA-Z]+$/))
      return true;
  return false;
}

function validEmail(email) {
  if (email.match(/^.[^@]+\@[^\@\\\/\[\]\;\'\"\?\>\<\,\+\=\*]+\..+$/))
    return true;
  return false;
}
