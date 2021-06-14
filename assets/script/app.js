import {WaveGroup} from './wavegroup.js';

// App class 생성
class App {
    constructor() {
        // canvas element 생성
        this.canvas = document.createElement('canvas');
        // canvas element에 2d 캔버스 생성
        this.ctx = this.canvas.getContext('2d');
        // 생성한 canvas elemnet를 HTML body에 추가
        document.body.appendChild(this.canvas);

        this.waveGroup = new WaveGroup();

        // 창의 크기가 바뀔때마다 resize 함수 재실행
        // 호출 방법과 관련없에 bind함수 사용하여 resize함수 호출, 기본 값은 false
        window.addEventListener('resize', this.resize.bind(this), false);
        // 기본으로 resize함수를 실행
        this.resize();
        // animate 업데이트하는 함수 기본 실행
        requestAnimationFrame(this.animate.bind(this));
    }

    // App class 안의 resize method 정의
    resize(){
        // canvas 영역을 사용자의 영역의 2배로 설정
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth *2;
        this.canvas.height = this.stageHeight *2;
        // 2d canvas의 x축 y축을 2배로 확대
        this.ctx.scale(2, 2);

        // waveGroup의 resize method 실행
        this.waveGroup.resize(this.stageWidth, this.stageHeight);
    }

    // App class 안의 animate method 정의
    animate(t) {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        
        this.waveGroup.draw(this.ctx);
        // animate를 반복 실행 loop
        requestAnimationFrame(this.animate.bind(this));
    }
}

// window 창 시작시 App class 함수 실행
window.onload = () => {
    new App();
    //const app = new App();
    //app.resize();
    //app.animate(t);
};