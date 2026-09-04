const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileBtn = document.getElementById("profileBtn");
const defaultProfileIcon = document.getElementById("defaultProfileIcon");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));


// Display current user
if (currentUser) {

    if (profileName) {
        profileName.textContent = currentUser.name;
    }

    if (currentUser.image && profileAvatar) {
        profileAvatar.src = currentUser.image;
        profileAvatar.style.display = "block";
    }

    if (currentUser.image && defaultProfileIcon) {
        defaultProfileIcon.style.display = "none";
    }
}

