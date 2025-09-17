
// email.js

emailjs.init({
  publicKey: "6ubbvbekwW9qlr3PE"
});

const SERVICE_ID = "service_6bnkkm9";
const TEMPLATE_ID = "template_lpduqhl";

// dynamic star generation in the ‘skill’ section
let starsSpan = document.querySelectorAll(".stars-container");
const starsRendering = new Promise(resolve => {
    starsSpan.forEach(starSpan => {
        let stars = `
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>`;
        starSpan.innerHTML = stars;
    })
    resolve();
})

await starsRendering;
const starsForSkill = [
    ["html5", 4],
    ["css", 3],
    ["js", 3],
    ["php",2],
    ["sql",2],
    ["js2",3],
    ["react",2],
    ["boot",2]
]


// this function filled the stars dynamically
function colorForStar(language) {
    let code = Array.from(document.querySelectorAll(`.${language[0]} .fa-star`))
    let i=0;
    let fillingStars = setInterval(() => {
        code[i].classList.add("filled");
        i++ 
        i === language[1] && clearInterval(fillingStars);
    }, 500);
}


// this loop allows each skill to have a certain amount of filled stars, based on 
// the array "starsForSkill"
function fillingAllStarsDifferently() {
    for (let n = 0 ; n <= starsForSkill.length-1; n++) {
        colorForStar(starsForSkill[n]);
    }
}


// this code allows animations when the user reaches the right section, not before
document.addEventListener("DOMContentLoaded", () => {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains("skills-section")) {
                        fillingAllStarsDifferently();
                        
                    } else if (entry.target.classList.contains("my-story")) {
                        document.querySelector(".carousel-track").classList.add("carousel-wiggle");
                    }
                    io.unobserve(entry.target);
                }
            })
        }, {
            root: null,
            threshold: 0.2,
            rootMargin: '0px 0px -50% 0px'
        });
        const targets = document.querySelectorAll(".skills-section, .my-story")
        targets.forEach(el => io.observe(el));
})


// form validation object
let validation = {
    fullNameValid:false,
    emailValid: false,
    projectTypeValid: false,
    consentValid : false,
    messageValid: false,
}

// error msg object
let error = {
    errorfullName: "Please enter more than 3 characters.",
    errorEmail : "Please enter a valid email address.",
    errorProjectType: "Error Project type",
    errorConsent : "Error consent",
    errorMessage : "Please write a message of more than 10 characters."
}

// data storage template
class requestTemplate {
    constructor(fullName, email, org, projectType, goal, hearAboutMe, nda, agreeToContact) {
        this.fullName=fullName;
        this.email=email;
        this.org=org;
        this.projectType=projectType;
        this.goal=goal;
        this.hearAboutMe=hearAboutMe;
        this.nda=nda;
        this.agreeToContact=agreeToContact;
    }
}


// function that checks if all the required inputs are valid
function validationProcess(element) {
     let expr = element.getAttribute("id");
        switch (expr) {
            case "full-name": 
            let fullName = element.value.trim();
            if(fullName==="" || fullName.length<3) {
                element.classList.add("wrong-input");
                document.querySelector(".error-msg.fullName").textContent = error.errorfullName;
                validation.fullNameValid=false;
            } else {
                validation.fullNameValid ||= true;
                element.classList.remove("wrong-input");
                 document.querySelector(".error-msg.fullName").textContent = "";
            };
            break;

            case "email":
            let email = element.value.trim();
            const emailRe = /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
            if (!emailRe.test(email)) {
                validation.emailValid=false;
                element.classList.add("wrong-input");
                document.querySelector(".error-msg.mail").textContent = error.errorEmail;
            } else {
                validation.emailValid ||= true;
                element.classList.remove("wrong-input");
                document.querySelector(".error-msg.mail").textContent = "";

            };
            break;

            case "project-type":
            let projectType = document.getElementById("project-type").selectedIndex;
            if (projectType === 0) {
                validation.projectTypeValid=false;
                element.classList.add("wrong-input");
            } else {
                validation.projectTypeValid ||= true;
                element.classList.remove("wrong-input");
            }
            break;

            case "message": 
            let message = element.value.trim();
            if(message==="" || message.length<10) {
                element.classList.add("wrong-input");
                document.querySelector(".error-msg.message").textContent = error.errorMessage;
                validation.messageValid=false;
            } else {
                validation.messageValid ||= true;
                element.classList.remove("wrong-input");
                document.querySelector(".error-msg.message").textContent = " ";

            };
            break;

            case "consent":
            let consent = document.getElementById("consent").checked;
            if (!consent) {
                validation.consentValid=false;
                element.nextElementSibling.classList.add("not-checked");
            } else {
                validation.consentValid ||= true;
                element.nextElementSibling.classList.remove("not-checked");
            }
            break;

            default: element.classList.remove("wrong-input");
        }
        return validation;
}


// validation on change 
document.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("input", (e) => {
        validationProcess(e.target);
        if (!Object.values(validation).includes(false)) {
           document.getElementById("submit-btn").disabled = false;
        } else {
            document.getElementById("submit-btn").disabled = true;
        }
    })
})
    

// submission

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let confirmationPromise;
    let confirmModal = document.createElement("dialog");
    let form = document.querySelector("form");
    //honeypot
    if (document.getElementById("website") && document.getElementById("website").value.trim()) return;
    //if all the requirements are met : 
    if (!document.getElementById("submit-btn").disabled) {
    // modal box to inform the user
    confirmModal.innerHTML = 
        `<p>Sending...</p>
        <span class="loader"></span>
        `
    document.body.appendChild(confirmModal);
    confirmModal.showModal();
    // sending...
    try {
        const sending = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
        if (sending.text === "OK") {
            // if successful, a confirmation msg appears
            confirmModal.innerHTML = '<p>Your message has been sent! I will get back to you as soon as possible.</p><span class="loader"></span>'
        } else {
            // if unsuccessful, an error msg appears
            confirmModal.innerHTML = `<p>An error interrupted the sending of your message. Please try again.</p><span class="loader"></span>`
        }
        confirmationPromise = new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 4000);

        })

    } catch (err) {
        console.error("Erreur:", err);
        confirmModal.innerHTML = `<p>An error interrupted the sending of your message. Please try again.</p><span class="loader"></span>`

    } finally {
        // we wait for the modal box to show then we refresh
        await confirmationPromise;
        document.getElementById("submit-btn").disabled = true;
        form.reset();
        confirmModal.open && confirmModal.close();
        confirmModal.remove();
        document.getElementById("collab-anchor").scrollIntoView({behavior:"smooth"});
       
    }
    
    } 
})


// light and dark mode
document.getElementById("dark-light-mode").addEventListener("change", (e) => {
    if (e.target.checked) {
        window.localStorage.setItem("lightOn", true)
        e.target.closest("span").classList.toggle("reverse");
    } else {
        window.localStorage.setItem("lightOn", false);
        e.target.closest("span").classList.toggle("reverse");

    } 
})


// carousel "my story"
let i = 0;
document.querySelector(".arrows-carousel").addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-arrow-left")) {
        if (i > 0) {
            i--;
            e.target.nextElementSibling.classList.contains("arrow-forbidden") && e.target.nextElementSibling.classList.remove("arrow-forbidden");
            i===0 && e.target.classList.add("arrow-forbidden");
        }
    } else if (e.target.classList.contains("fa-arrow-right")) {
        if (i < 4) {
            i++;
            e.target.previousElementSibling.classList.contains("arrow-forbidden") && e.target.previousElementSibling.classList.remove("arrow-forbidden");
            i===4 && e.target.classList.add("arrow-forbidden");
        }
    }
    document.querySelector(".carousel-track").style.setProperty("transform", `translateX(${i*-100}%)`)
})
