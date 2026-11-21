 function showText(n) {

            document.querySelectorAll('.classical-text')
                .forEach(text => text.classList.remove('active'));
            document.querySelector('.classical-text.text' + n)?.classList.add('active');

            document.querySelectorAll('.classical-imgs img')
                .forEach(img => img.classList.remove('active'));
            document.querySelector('.classical-imgs .img' + n)?.classList.add('active');

            document.querySelectorAll('.classical-button')
                .forEach(button => button.classList.remove('active'));
            document.querySelector('.classical-button.button' + n)?.classList.add('active');
        }