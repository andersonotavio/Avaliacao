import { getFromStorage, checkStorage, setInStorage } from "../functions/storage";

$(function() {
  let validador = {
    handleSubmit: event => {
      event.preventDefault()
      let send = true

      let inputs = form.querySelectorAll('.val')
      let tel = document.getElementById('phone').value

      validador.clearErrors()

      for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        let check = validador.checkInput(input)
        if (check !== true) {
          send = false
          validador.showError(input, check)
        }
      }

      if (send) {
        form.submit()
        validador.salveStorage()
      }
    },
    checkInput: input => {
      let rules = input.getAttribute('data-rules')

      if (rules !== null) {
        rules = rules.split('|')
        for (let k in rules) {
          let rDetails = rules[k].split('=')
          switch (rDetails[0]) {
            case 'required':
              if (input.value == '') {
                return 'Campo não pode ser vazio.'
              }
              break
            case 'min':
              if (input.value.length < rDetails[1]) {
                return (
                  'Campo tem que ter pelo menos ' + rDetails[1] + ' caractes'
                )
              }
              break
            case 'email':
              if (input.value != '') {
                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if (!regex.test(input.value.toLowerCase())) {
                  return 'E-mail digitado não é válido!'
                }
              }
              break
              case 'phone':
              if (!validador.isValidPhone(input.value)) {
                return 'Digite número válido '
              }
              break
          }
        }
      }

      return true
    },
    showError: (input, error) => {
      input.style.borderColor = '#FF0000'

      let errorElement = document.createElement('div')
      errorElement.classList.add('error')
      errorElement.innerHTML = error

      input.parentElement.insertBefore(errorElement, input.ElementSibling)
    },
    clearErrors: () => {
      let inputs = form.querySelectorAll('.val')
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].style = ''
      }

      let errorElements = document.querySelectorAll('.error')
      for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].remove()
      }
    },
    isValidPhone: (phone) => {
  
      phone = phone.replace(/\D/g, '');
    
      if (!(phone.length >= 10 && phone.length <= 11)) return false;
    
      if (phone.length == 11 && parseInt(phone.substring(2, 3)) != 9) return false;
    
      for (var n = 0; n < 10; n++) {
          if (phone == new Array(11).join(n) || phone == new Array(12).join(n)) return false;
      }
      
      var DDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
          21, 22, 24, 27, 28, 31, 32, 33, 34,
          35, 37, 38, 41, 42, 43, 44, 45, 46,
          47, 48, 49, 51, 53, 54, 55, 61, 62,
          64, 63, 65, 66, 67, 68, 69, 71, 73,
          74, 75, 77, 79, 81, 82, 83, 84, 85,
          86, 87, 88, 89, 91, 92, 93, 94, 95,
          96, 97, 98, 99];
          
      if (DDD.indexOf(parseInt(phone.substring(0, 2))) == -1) return false;
    
      if (phone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(phone.substring(2, 3))) == -1) return false;
    
      return true;
    },
    salveStorage: () => {
      let nome = document.getElementById('name').value;
      let email = document.getElementById('email').value;
      let phone = document.getElementById('phone').value;
      let assunto = document.getElementById('assunto').value;
      let mensagem = document.getElementById('mensagem').value;

      setInStorage('nome', nome);
      setInStorage('email', email);
      setInStorage('phone', phone);
      setInStorage('assunto', assunto);
      setInStorage('mensagem', mensagem);
    }
  }
  $("#name").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".nameInput").text(item.val());
    } else {
      $(".nameInput").text("---");
    }
  });

  $("#email").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".emailInput").text(item.val());
    } else {
      $(".emailInput").text("---");
    }
  });

  $("#phone").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".phoneInput").text(item.val());
    } else {
      $(".phoneInput").text("---");
    }
  });

  $("#assunto").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".assuntoInput").text(item.val());
    } else {
      $(".assuntoInput").text("---");
    }
  });

  $("#mensagem").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".mensagemInput").text(item.val());
    } else {
      $(".mensagemInput").text("---");
    }
  });


  let form = document.querySelector('#formContact')
  form.addEventListener('submit', validador.handleSubmit);

})
