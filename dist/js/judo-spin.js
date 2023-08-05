/**
 * Judo Spin
 * @name        judo-spin
 * @description 360° degrees image spinner using JavaScript.
 * @link        https://github.com/Rodgath/judo-spin
 * @author      Rodgath, https://Rodgath.com
 * @version     v1.0.0
 * @created     July 22, 2023
 * @updated     August 04, 2023
 * @copyright   Copyright (C) 2023-2023, Rodgath
 * @license     MIT
 * @licenseMIT  https://github.com/Rodgath/judo-spin/blob/main/LICENSE
 * @demoExample https://rodgath.github.io/judo-spin/demo/
 */
function judoSpin(element, options) {

  var defaults = {
    currImg: 1,
    images: []
  };
  
  /* Check if options argument is provided directly or in the data attribute */
  if (!options) {
    var dataAttributeOptions = element.dataset.judoSpin;
    if (dataAttributeOptions) {
      options = JSON.parse(dataAttributeOptions);
    }
  }

  /* Merge 'options' with 'defaults' */
  options = Object.assign({}, defaults, options);
    
  /* Current image starts at 0 or based on options entry */
  let currImagePos = convertCurrImageNumber(options.currImage) - 1;

  /* Set judo box element */
  let judoSpinBox;

  /* Set judo box wrapper element */
  let judoSpinWrapper;
  
  /* Check if 'element' is a valid DOM element */
  if (element instanceof HTMLElement || element instanceof Node) {
    judoSpinBox = element;
  } else {
    judoSpinBox = document.querySelector(element);
  }
  
  /* Get all the images inside the spinbox element */
  const imagesToSpin = getImagesToSpin();
  const totalImages = imagesToSpin.length;

  /* Calculate the angle between each image */
  const anglePerImage = 360 / totalImages;

  /* Set the initial angle to 0 or based on current mage*/
  let currentAngle = currImagePos > 0 ? currImagePos * anglePerImage : 0;

  /* Flag to track if the motion should start */
  let motionStarted = false;

  /* Create the overlay div element */
  const overlayElement = document.createElement('div');
  
  /* Convert a string to a positive number or its absolute value if negative */
  function convertCurrImageNumber(str) {
    const number = parseInt(str, 10); // Convert string to integer

    if (!isNaN(number)) {
      return Math.abs(number);
    } else {
      return 1;
    }
  }

  /* Get the images to spin */
  function getImagesToSpin() {

    let spinImages;
    
    /* Check if ihe "images" property exists, is an array, and has items */
    if (options.hasOwnProperty('images') && Array.isArray(options.images) && options.images.length > 0) {
      
      options.images.forEach(imageObj => {
        const imgElement = document.createElement('img');
        imgElement.src = imageObj.src;
        imgElement.alt = imageObj.title;
        
        judoSpinBox.appendChild(imgElement);
      });

      spinImages = judoSpinBox.querySelectorAll('img')
    } else {
      spinImages = judoSpinBox.querySelectorAll('img')
    }

    return spinImages;
  }

  /* Set the attributes and styles for the overlay element */
  (function(overlayElement) {
    overlayElement.className = 'judo-spin-overlay';
    overlayElement.style.position = 'absolute';
    overlayElement.style.width = '100%';
    overlayElement.style.height = '100%';
    overlayElement.style.top = '0';
    overlayElement.style.left = '0';
    overlayElement.style.zIndex = '1';

    judoSpinBox.appendChild(overlayElement);

    /* Add event listeners to change cursor on hover and reset on mouseout */
    overlayElement.addEventListener('mouseover', () => overlayElement.style.cursor = 'e-resize');
    overlayElement.addEventListener('mouseout', () => overlayElement.style.cursor = 'auto');

  })(overlayElement);

  /* Set Judo spin box attributes and styles */
  (function(judoSpinBox) {
    judoSpinBox.classList.add('judo-spin-container');
    judoSpinBox.style.position = 'relative';
    judoSpinBox.style.width = '100%';
    judoSpinBox.style.height = 'auto';
    judoSpinBox.style.overflow = 'hidden';
  })(judoSpinBox);
  
  /* Set images' attributes and styles */
  (function(judoSpinBox) {
    const images = judoSpinBox.getElementsByTagName('img');

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      image.style.width = '100%';
    }
  })(judoSpinBox);

  /* Create judoSpinBox wrapper */
  (function(judoSpinBox) {
    judoSpinWrapper = document.createElement('div');
    judoSpinWrapper.classList.add('judo-spin-wrapper');
    judoSpinWrapper.style.width = 'fit-content';
    judoSpinWrapper.style.margin = '0 auto';
    judoSpinBox.parentNode.insertBefore(judoSpinWrapper, judoSpinBox);
    judoSpinWrapper.appendChild(judoSpinBox);
  })(judoSpinBox);

  /* Handle mousedown event */
  const handleMouseDown = event => invokeMotion(event);

  /* Handle touchstart event */
  const handleTouchStart = event => invokeMotion(event);

  /* Listen for mousedown and touchstart events on the overlayElement element */
  overlayElement.addEventListener('mousedown', handleMouseDown);
  overlayElement.addEventListener('touchstart', handleTouchStart);

  /* Invoke image spin motion based on mousemove and touchmove events */
  const invokeMotion = event => {

    event.preventDefault();

    const _event = event.type === 'touchstart' ? 'touchmove' : 'mousemove';
    const _listener = event.type === 'touchstart' ? handleTouchMove : handleMouseMove;

    console.log(event.type);
    
    /* Start motion */
    motionStarted = true;

    /* Get the index of the current visible image */
    const currentIndex = calculateImageIndex(currentAngle);
    
    /* Calculate the initial angle based on the current visible image */
    currentAngle = currentIndex * anglePerImage;

    /* Listen for touchmove event */
    overlayElement.addEventListener(_event, _listener);
  }

  /* Handle mouseup event */
  const handleMouseUp = () => {
    motionStarted = false;
    overlayElement.removeEventListener('mousemove', handleMouseMove);
  }

  /* Handle touchend event */
  const handleTouchEnd = () => {
    motionStarted = false;
    overlayElement.removeEventListener('touchmove', handleTouchMove);
  }

  /* Add event listeners for mouseup and touchend events */
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchend', handleTouchEnd);

  /* Handle mousemove event */
  const handleMouseMove = event => handleMovement(event);

  /* Handle touchmove event */
  const handleTouchMove = event => handleMovement(event);

  /* Handle image spin movement based on event */
  const handleMovement = event => {
    if (motionStarted) {
      const _clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      const _clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;

      const dir = detectDirection(_clientX, _clientY);

      dir === 'right' ? currImagePos++ : dir === 'left' ? currImagePos-- : null;

      /* Calculate the rotation angle based on mouse or touch position */
      const maxRotation = 360; // 360 degrees for a full rotation; Maybe alterable
      currentAngle = currImagePos * anglePerImage;
      
      /* Adjust currentAngle to be within the range of 0 to 359 degrees, without negavtive numbers */
      currentAngle = (currentAngle % maxRotation + maxRotation) % maxRotation;

      showImageForAngle(currentAngle);
    }
  }
  
  /* Calculate the current image index based on the current angle */
  const calculateImageIndex = angle => {

    let index = Math.floor(angle / anglePerImage);

    if (index < 0) {
        index = totalImages - 1;
    } else if (index >= totalImages) {
        index = 0;
    }
    return index;
  }

  /* Show the image based on the current angle */
  const showImageForAngle = angle => {

      /* get the index of the image to show based on the angle and total images */
      const imageIndex = Math.floor(angle / anglePerImage) + 1;

      /* Show the corresponding image and hide the others */
      for (let i = 1; i <= totalImages; i++) {
        const img = judoSpinBox.querySelector('img:nth-child(' + i + ')');
        img.style.display = (i === imageIndex) ? 'block' : 'none';
      }
  }
  
  /* Show the preferred/intended image by default */
  showImageForAngle(currentAngle);

  /* Store the previous position of the mouse/touch */
  let prevX = null;
  let prevY = null;

  /* Mouse/touch sensitivity factor */
  const sensitivity = 1; // Increase for higher sensitivity, decrease for lower sensitivity

  /* Detect the direction */
  function detectDirection(currentX, currentY) {
    let direction;
    if (prevX !== null && prevY !== null) {
      const deltaX = currentX - prevX;

      if (deltaX > sensitivity) {
        direction = 'right';
      } else if (deltaX < -sensitivity) {
        direction = 'left';
      }
    }

    /* Update the previous position to the current position */
    prevX = currentX;
    prevY = currentY;

    return direction;
  }

  /* Handle draggable scroller */
  function draggableScroller() {

    /* Create Judo scroller element */
    const judoScroller = document.createElement('div');
    judoScroller.id = 'judo-scroller';
    judoScroller.style.cssText = `
    position: relative;
    width: 100%;
    height: 20px;
    background-color: #f1f1f1;
    margin: 20px auto;
    border-radius: 10px;
    cursor: pointer;`;

    /* Create Judo draggable element */
    const judoDraggable = document.createElement('div');
    judoDraggable.id = 'judo-draggable';
    judoDraggable.style.cssText = `position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 20px;
    background-color: #4caf50;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;`;
    
    /* Append elements to respective parent nodes */
    judoScroller.appendChild(judoDraggable);
    judoSpinWrapper.appendChild(judoScroller);
    
    /* Flag to track if the button is being dragged */
    let dragging = false;

    /* Add event listeners to the draggable button for dragging */
    judoDraggable.addEventListener('mousedown', handleDragStart);
    judoDraggable.addEventListener('touchstart', handleDragStart);

    /* Handle drag start event */
    function handleDragStart(event) {
      event.preventDefault();
      dragging = true;
      
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove);
    }

    /* Handle drag move event */
    function handleDragMove(event) {
      if (dragging) {
        const judoScrollerRect = judoScroller.getBoundingClientRect();
        const buttonWidth = judoDraggable.offsetWidth;
        const minScrollPos = 0;
        const maxScrollPos = judoScroller.offsetWidth - buttonWidth;

        let scrollPos;

        if (event.type === 'touchmove') {
          scrollPos = event.touches[0].clientX - judoScrollerRect.left - buttonWidth / 2;
        } else {
          scrollPos = event.clientX - judoScrollerRect.left - buttonWidth / 2;
        }

        /* Ensure the scroll position stays within bounds */
        scrollPos = Math.max(minScrollPos, Math.min(maxScrollPos, scrollPos));

        /* Update the draggable button position */
        judoDraggable.style.left = `${scrollPos}px`;

        /* Calculate the current angle based on the scroll position */
        const maxRotation = 360; // 360 degrees for a full rotation
        const anglePerScroll = maxRotation / maxScrollPos;
        currentAngle = Math.floor(scrollPos * anglePerScroll);

        /* Adjust currentAngle to be within the range of 0 to 359 degrees */
        currentAngle = (currentAngle % maxRotation + maxRotation) % maxRotation;

        /* Show the corresponding image based on the current angle */
        showImageForAngle(currentAngle);
      }
    }

    /* Handle drag end event */
    function handleDragEnd() {
      dragging = false;
      /* Remove the mousemove and touchmove event listeners */
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
    }

    /* Add event listeners for mouseup and touchend events */
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  }

  draggableScroller();
}

/* Call the function for elements with the 'data-judo-spin' attribute */
const judoSpinElements = document.querySelectorAll('[data-judo-spin]');
judoSpinElements.forEach(element => judoSpin(element));