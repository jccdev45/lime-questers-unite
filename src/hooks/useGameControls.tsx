import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GameControlsProps {
  isLocked: boolean;
  controlsRef: React.RefObject<any>;
  playerRef: React.RefObject<THREE.Group>;
  movementRef: React.RefObject<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    running: boolean;
  }>;
  fire: () => void;
  reload: () => void;
  changeWeapon: (weapon: string) => void;
  isFiring: boolean;
  setIsFiring: (isFiring: boolean) => void;
  updatePosition: (x: number, y: number, z: number, rotationY: number) => void;
  roomId: string;
}

const useGameControls = ({
  isLocked,
  controlsRef,
  playerRef,
  movementRef,
  fire,
  reload,
  changeWeapon,
  isFiring,
  setIsFiring,
  updatePosition,
  roomId,
}: GameControlsProps) => {
  // Fix for automatic firing
  const fireIntervalRef = useRef<number | null>(null);

  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!movementRef.current) return;

      switch (e.code) {
        case "KeyW":
          movementRef.current.forward = true;
          break;
        case "KeyS":
          movementRef.current.backward = true;
          break;
        case "KeyA":
          movementRef.current.left = true;
          break;
        case "KeyD":
          movementRef.current.right = true;
          break;
        case "ShiftLeft":
          movementRef.current.running = true;
          break;
        case "KeyR":
          reload();
          break;
        case "Digit1":
          changeWeapon("pistol");
          break;
        case "Digit2":
          changeWeapon("rifle");
          break;
        case "Escape":
          if (controlsRef.current) {
            controlsRef.current.unlock();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!movementRef.current) return;

      switch (e.code) {
        case "KeyW":
          movementRef.current.forward = false;
          break;
        case "KeyS":
          movementRef.current.backward = false;
          break;
        case "KeyA":
          movementRef.current.left = false;
          break;
        case "KeyD":
          movementRef.current.right = false;
          break;
        case "ShiftLeft":
          movementRef.current.running = false;
          break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && isLocked) {
        setIsFiring(true);
        fire();

        // Clear any existing interval
        if (fireIntervalRef.current) {
          clearInterval(fireIntervalRef.current);
        }

        // Set up new interval
        fireIntervalRef.current = window.setInterval(() => {
          if (isFiring) {
            fire();
          }
        }, 300);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsFiring(false);

        // Clear the interval when mouse is up
        if (fireIntervalRef.current) {
          clearInterval(fireIntervalRef.current);
          fireIntervalRef.current = null;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);

      // Clear interval on cleanup
      if (fireIntervalRef.current) {
        clearInterval(fireIntervalRef.current);
        fireIntervalRef.current = null;
      }
    };
  }, [
    isLocked,
    isFiring,
    fire,
    reload,
    changeWeapon,
    controlsRef,
    setIsFiring,
  ]);

  // Handle player movement
  useEffect(() => {
    if (!playerRef.current || !controlsRef.current) return;

    const movementSpeed = 0.15;
    const runningMultiplier = 1.5;

    const updatePlayerMovement = () => {
      if (
        !isLocked ||
        !controlsRef.current ||
        !playerRef.current ||
        !movementRef.current
      )
        return;

      const camera = controlsRef.current.getObject();
      if (!camera) return;

      const speed = movementRef.current.running
        ? movementSpeed * runningMultiplier
        : movementSpeed;

      // Get direction vector
      const direction = new THREE.Vector3();
      const rotation = new THREE.Euler(0, camera.rotation.y, 0, "YXZ");

      // Calculate movement based on keys pressed
      if (movementRef.current.forward) {
        direction.z -= 1;
      }
      if (movementRef.current.backward) {
        direction.z += 1;
      }
      if (movementRef.current.left) {
        direction.x -= 1;
      }
      if (movementRef.current.right) {
        direction.x += 1;
      }

      // Normalize direction vector
      if (direction.length() > 0) {
        direction.normalize();
      }

      // Apply camera rotation to movement
      direction.applyEuler(rotation);

      // Update player position
      playerRef.current.position.x += direction.x * speed;
      playerRef.current.position.z += direction.z * speed;

      // Update game state with new position
      updatePosition(
        playerRef.current.position.x,
        playerRef.current.position.y,
        playerRef.current.position.z,
        camera.rotation.y
      );
    };

    const interval = setInterval(updatePlayerMovement, 16);

    return () => clearInterval(interval);
  }, [isLocked, updatePosition, controlsRef, playerRef]);

  // Implement proper lock/unlock handlers
  const handleLock = () => {
    // This function is called when the pointer lock is acquired
    console.log("Pointer lock acquired");
  };

  const handleUnlock = () => {
    // This function is called when the pointer lock is released
    console.log("Pointer lock released");
  };

  return {
    handleLock,
    handleUnlock,
  };
};

export default useGameControls;
