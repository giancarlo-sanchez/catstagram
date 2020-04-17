//const fetch = require("fetch");
const startLoader = () => {
  document.querySelector(".loader").innerHTML = "Loading...";
};

const stopLoader = () => {
  document.querySelector(".loader").innerHTML = "";
};

const clearError = () => {
  document.querySelector(".error").innerHTML = "";
};


const handleResponse = response => {
  stopLoader();
  clearError();

  if (!response.ok) {
    throw response;
  }
  return response.json();
};



const fetchImage = ()=>{
    document.querySelector(".loader").innerHTML = "Loading...";

    document.querySelector(".error").innerHTML = "";
    fetch("kitten/image")

        .then(res =>{
            if(!res.ok){
              document.querySelector(".loader").innerHTML = "";

                throw res;
            }
            document.querySelector(".loader").innerHTML = "";
            document.querySelector(".error").innerHTML = "";
            return res.json();
        }).then(data =>{
            //console.log(data.src);

            document.querySelector(".cat-pic").src = data.src;
            document.querySelector(".score").innerHTML = data.score;
            document.querySelector(".comments").src = data.comments;

        }).catch(error => {
            if (error.json) {
              error.json().then(errorJSON => {
                document.querySelector(".error").innerHTML = `Error occured: ${errorJSON.message}`;
                document.querySelector(".cat-pic").src = "";
              });
            } else {
              console.error(error);
              alert("Something went wrong. Please try again!");
            }
          });
}
window.addEventListener("DOMContentLoaded",fetchImage);
document.getElementById('new-pic').addEventListener('click',fetchImage)

document.getElementById('upvote').addEventListener('click',()=>{
  fetch("/kitten/upvote",{method: "PATCH"})
  .then(res =>{
    if(!res.ok){
      document.querySelector(".loader").innerHTML = "";

        throw res;
    }
    document.querySelector(".loader").innerHTML = "";
    document.querySelector(".error").innerHTML = "";
    return res.json();
  })
  .then(data =>{
    const {score} = data;
    document.querySelector(".score").innerHTML = score;

  }).catch(error => {
    if (error.json) {
      error.json().then(errorJSON => {
        document.querySelector(".error").innerHTML = `Error occured: ${errorJSON.message}`;
        //document.querySelector("#score").innerHTML = 0;
        document.querySelector(".cat-pic").src = "";

      });
    } else {
      console.error(error);
      alert("Something went wrong. Please try again!");
      //document.querySelector("#score").innerHTML = 0;
    }
  });
});

document.getElementById('downvote').addEventListener('click',()=>{
  fetch("/kitten/downvote",{method: "PATCH"})
  .then(res =>{
    if(!res.ok){
      document.querySelector(".loader").innerHTML = "";

        throw res;
    }
    document.querySelector(".loader").innerHTML = "";
    document.querySelector(".error").innerHTML = "";
    return res.json();
  })
  .then(data =>{
    const {score} = data;
    document.querySelector(".score").innerHTML = score;

  }).catch(error => {
    if (error.json) {
      error.json().then(errorJSON => {
        document.querySelector(".error").innerHTML = `Error occured: ${errorJSON.message}`;
        //document.querySelector("#score").innerHTML = 0;
        document.querySelector(".cat-pic").src = "";

      });
    } else {
      console.error(error);
      alert("Something went wrong. Please try again!");
      //document.querySelector("#score").innerHTML = 0;
    }
  });
});

const receiveComments = data => {
  const comments = document.querySelector(".comments");
  comments.innerHTML = "";
  data.comments.forEach((comment, i) => {
    const newCommentContainer = document.createElement("div");
    newCommentContainer.className = "comment-container";

    const newComment = document.createElement("p");
    newComment.appendChild(document.createTextNode(comment));

    const deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("id", i);

    newCommentContainer.appendChild(newComment);
    newCommentContainer.appendChild(deleteButton);
    comments.appendChild(newCommentContainer);
  });
};

const commentForm = document.querySelector(".comment-form");

commentForm.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(commentForm);
  const comment = formData.get("user-comment");
  fetch("http://localhost:3000/kitten/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ comment })
  })
    .then(handleResponse)
    .then(data => {
      commentForm.reset();
      receiveComments(data);
    })
    .catch(error => {
      if (error.json) {
        error.json().then(errorJSON => {
          document.querySelector(".error").innerHTML = `Error occured: ${errorJSON.message}`;
          //document.querySelector("#score").innerHTML = 0;
          document.querySelector(".cat-pic").src = "";

        });
      } else {
        console.error(error);
        alert("Something went wrong. Please try again!");
        //document.querySelector("#score").innerHTML = 0;
      }
    });
});

document.querySelector(".comments").addEventListener("click", event => {
  if (event.target.tagName != "BUTTON") return;

  fetch(`kitten/comments/${event.target.id}`, { method: "DELETE" })
    .then(handleResponse)
    .then(data => receiveComments(data))
    .catch(error => {
      if (error.json) {
        error.json().then(errorJSON => {
          document.querySelector(".error").innerHTML = `Error occured: ${errorJSON.message}`;
          //document.querySelector("#score").innerHTML = 0;
          document.querySelector(".cat-pic").src = "";

        });
      } else {
        console.error(error);
        alert("Something went wrong. Please try again!");
        //document.querySelector("#score").innerHTML = 0;
      }
    });
});
