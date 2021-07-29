const TabsSlide = {
    data() {
        return {
            event_list: [
                {
                    key: "mousedown",
                    func: "onMouseDown",
                },
                {
                    key: "mouseup",
                    func: "onMouseUp",
                },
                {
                    key: "mousemove",
                    func: "onMouseMove",
                },
                {
                    key: "mouseleave",
                    func: "onMouseLeave",
                },
                {
                    key: "touchstart",
                    func: "onTouchStart",
                },
                {
                    key: "touchmove",
                    func: "onTouchMove",
                },
            ]
        }
    },
    created() {
        this.$nextTick(() => {
          this.eventController("add");
        });
    },
    methods: {
        eventController(type) {
          this.navElement = this.$refs["my-tabs"].$el.querySelector("ul");
          this.event_list.forEach((obj) => {
            if (type == "remove") {
              this.navElement.removeEventListener(obj.key, this[obj.func]);
            } else {
              this.navElement.addEventListener(obj.key, this[obj.func]);
            }
          });
        },
        onTouchStart(event) {
          this.startX = event.touches[0].pageX - this.navElement.offsetLeft;
          this.scrollLeft = this.navElement.scrollLeft;
        },
        onTouchMove(event) {
          event.preventDefault();
          const x = event.touches[0].pageX - this.navElement.offsetLeft;
          const speed = 1;
          const walk = (x - this.startX) * speed;
          this.navElement.scrollLeft = this.scrollLeft - walk;
        },
        onMouseDown(event) {
          this.isMouseDown = true;
          this.startX = event.pageX - this.navElement.offsetLeft;
          this.scrollLeft = this.navElement.scrollLeft;
        },
        onMouseUp(event) {
          this.isMouseDown = false;
        },
        onMouseLeave(event) {
          this.isMouseDown = false;
        },
        onMouseMove(event) {
          if (!this.isMouseDown) return;
          event.preventDefault();
          const x = event.pageX - this.navElement.offsetLeft;
          const speed = 1.5;
          const walk = (x - this.startX) * speed;
          this.navElement.scrollLeft = this.scrollLeft - walk;
        },
    },
    beforeDestroy() {
        this.eventController("remove");
    }
};
export default TabsSlide;
