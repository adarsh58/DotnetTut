import React, { useState, useEffect, useRef } from 'react';
import CsharpCodeBlock from './CsharpCodeBlock.jsx';

export default function LeetCodeVisualizer({ patternId, csharpCode }) {
  // Inputs
  const [arrayInput, setArrayInput] = useState(() => {
    if (patternId === 'dutch-national-flag') return '2, 0, 1, 2, 0, 1, 1, 2';
    if (patternId === 'binary-search' || patternId === 'lower-upper-bound' || patternId === 'opposite-ends') return '1, 3, 5, 8, 12, 15, 18, 21';
    if (patternId === 'kadane') return '-2, 1, -3, 4, -1, 2, 1, -5, 4';
    if (patternId === 'fixed-window' || patternId === 'variable-window') return '2, 3, 1, 2, 4, 3';
    if (patternId === 'next-greater-element') return '4, 5, 2, 25';
    if (patternId === 'brian-kernighan') return '13';
    return '1, 2, 3, 4, 5';
  });

  const [targetInput, setTargetInput] = useState(() => {
    if (patternId === 'binary-search' || patternId === 'lower-upper-bound') return '15';
    if (patternId === 'opposite-ends') return '17'; // Two Sum II target
    if (patternId === 'fixed-window') return '3'; // window size K
    if (patternId === 'variable-window') return '7'; // target sum S
    if (patternId === '1d-dp') return '5'; // coin change amount
    return '10';
  });

  // Simulator State
  const [frames, setFrames] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step
  const playTimer = useRef(null);

  // Re-generate simulation frames when inputs or patterns change
  useEffect(() => {
    generateFrames();
    setIsPlaying(false);
    setCurrentFrameIdx(0);
  }, [patternId, arrayInput, targetInput]);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      playTimer.current = setInterval(() => {
        setCurrentFrameIdx(prev => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (playTimer.current) clearInterval(playTimer.current);
    }
    return () => {
      if (playTimer.current) clearInterval(playTimer.current);
    };
  }, [isPlaying, frames, speed]);

  const parseArray = (str) => {
    return str.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  };

  // Generate Simulation Frames for Different Algorithms
  const generateFrames = () => {
    const arr = parseArray(arrayInput);
    const target = parseInt(targetInput) || 0;
    const generated = [];

    if (patternId === 'binary-search') {
      // B-Search Simulation
      let low = 0;
      let high = arr.length - 1;
      
      generated.push({
        array: [...arr],
        pointers: [{ name: 'L', idx: low, color: '#f59e0b' }, { name: 'H', idx: high, color: '#ef4444' }],
        variables: { low, high, mid: 'N/A', target },
        line: 5,
        message: `Initialize pointers: low = ${low}, high = ${high}. Target = ${target}.`
      });

      while (low <= high) {
        let mid = Math.floor(low + (high - low) / 2);
        
        generated.push({
          array: [...arr],
          pointers: [
            { name: 'L', idx: low, color: '#f59e0b' },
            { name: 'H', idx: high, color: '#ef4444' },
            { name: 'M', idx: mid, color: '#06b6d4' }
          ],
          variables: { low, high, mid, target, 'nums[mid]': arr[mid] },
          line: 9,
          message: `Calculate midpoint: mid = ${mid} (value = ${arr[mid]}).`
        });

        if (arr[mid] === target) {
          generated.push({
            array: [...arr],
            pointers: [{ name: 'Match', idx: mid, color: '#10b981' }],
            variables: { low, high, mid, target, 'nums[mid]': arr[mid] },
            line: 10,
            message: `Match found! nums[mid] (${arr[mid]}) equals target (${target}). Return index ${mid}.`
          });
          break;
        } else if (arr[mid] < target) {
          const oldLow = low;
          low = mid + 1;
          generated.push({
            array: [...arr],
            pointers: [
              { name: 'L', idx: oldLow, color: '#f59e0b' },
              { name: 'H', idx: high, color: '#ef4444' },
              { name: 'M', idx: mid, color: '#06b6d4' }
            ],
            variables: { low, high, mid, target },
            line: 11,
            message: `Since nums[mid] (${arr[mid]}) &lt; target (${target}), search right half. Set low = mid + 1 (${low}).`
          });
        } else {
          const oldHigh = high;
          high = mid - 1;
          generated.push({
            array: [...arr],
            pointers: [
              { name: 'L', idx: low, color: '#f59e0b' },
              { name: 'H', idx: oldHigh, color: '#ef4444' },
              { name: 'M', idx: mid, color: '#06b6d4' }
            ],
            variables: { low, high, mid, target },
            line: 12,
            message: `Since nums[mid] (${arr[mid]}) &gt; target (${target}), search left half. Set high = mid - 1 (${high}).`
          });
        }
      }

      if (low > high) {
        generated.push({
          array: [...arr],
          pointers: [],
          variables: { low, high, target },
          line: 14,
          message: `low (${low}) exceeded high (${high}). Target element is not present. Return -1.`
        });
      }
    } 
    else if (patternId === 'dutch-national-flag') {
      // Dutch National Flag (0, 1, 2 Sorting)
      let low = 0;
      let mid = 0;
      let high = arr.length - 1;
      let currentArr = [...arr];

      generated.push({
        array: [...currentArr],
        pointers: [{ name: 'L', idx: low, color: '#f59e0b' }, { name: 'M', idx: mid, color: '#06b6d4' }, { name: 'H', idx: high, color: '#ef4444' }],
        variables: { low, mid, high },
        line: 6,
        message: `Initialize pointers: low = ${low}, mid = ${mid}, high = ${high}.`
      });

      while (mid <= high) {
        const val = currentArr[mid];
        
        generated.push({
          array: [...currentArr],
          pointers: [{ name: 'L', idx: low, color: '#f59e0b' }, { name: 'M', idx: mid, color: '#06b6d4' }, { name: 'H', idx: high, color: '#ef4444' }],
          variables: { low, mid, high, 'nums[mid]': val },
          line: 9,
          message: `Evaluate mid element nums[mid] = ${val}.`
        });

        if (val === 0) {
          // Swap mid and low
          const temp = currentArr[mid];
          currentArr[mid] = currentArr[low];
          currentArr[low] = temp;
          
          low++;
          mid++;
          generated.push({
            array: [...currentArr],
            pointers: [{ name: 'L', idx: low, color: '#f59e0b' }, { name: 'M', idx: mid, color: '#06b6d4' }, { name: 'H', idx: high, color: '#ef4444' }],
            variables: { low, mid, high },
            line: 11,
            message: `Value is 0. Swap with nums[low]. Increment low and mid.`
          });
        } else if (val === 1) {
          mid++;
          generated.push({
            array: [...currentArr],
            pointers: [{ name: 'L', idx: low, color: '#f59e0b' }, { name: 'M', idx: mid, color: '#06b6d4' }, { name: 'H', idx: high, color: '#ef4444' }],
            variables: { low, mid, high },
            line: 13,
            message: `Value is 1. Already in correct middle group. Increment mid.`
          });
        } else {
          // Swap mid and high
          const temp = currentArr[mid];
          currentArr[mid] = currentArr[high];
          currentArr[high] = temp;
          
          high--;
          generated.push({
            array: [...currentArr],
            pointers: [{ name: 'L', idx: low, color: '#f59e0b' }, { name: 'M', idx: mid, color: '#06b6d4' }, { name: 'H', idx: high, color: '#ef4444' }],
            variables: { low, mid, high },
            line: 15,
            message: `Value is 2. Swap with nums[high]. Decrement high pointer. (Note: do not increment mid because swapped value needs evaluation).`
          });
        }
      }

      generated.push({
        array: [...currentArr],
        pointers: [],
        variables: { low, mid, high },
        line: 18,
        message: `Sorting finished! Array is partitioned into 0s, 1s, and 2s.`
      });
    }
    else if (patternId === 'kadane') {
      // Kadane Maximum Subarray
      if (arr.length === 0) return;
      let maxSoFar = arr[0];
      let currentMax = arr[0];
      
      generated.push({
        array: [...arr],
        pointers: [{ name: 'curr', idx: 0, color: '#06b6d4' }],
        variables: { maxSoFar, currentMax, i: 0 },
        line: 5,
        message: `Initialize: currentMax = ${currentMax}, maxSoFar = ${maxSoFar} (at index 0).`
      });

      for (let i = 1; i < arr.length; i++) {
        let val = arr[i];
        
        // Choose extend or start new
        currentMax = Math.max(val, currentMax + val);
        maxSoFar = Math.max(maxSoFar, currentMax);

        generated.push({
          array: [...arr],
          pointers: [{ name: 'curr', idx: i, color: '#06b6d4' }],
          variables: { maxSoFar, currentMax, i, 'nums[i]': val },
          line: 9,
          message: `Index ${i} (value = ${val}). Decide: currentMax = Math.Max(${val}, ${currentMax - val} + ${val}) = ${currentMax}. Update maxSoFar = ${maxSoFar}.`
        });
      }

      generated.push({
        array: [...arr],
        pointers: [],
        variables: { maxSoFar },
        line: 11,
        message: `Finished linear scan. Maximum subarray sum is ${maxSoFar}.`
      });
    }
    else if (patternId === 'opposite-ends') {
      // Two Sum II (Opposite Ends)
      let left = 0;
      let right = arr.length - 1;
      let found = false;

      generated.push({
        array: [...arr],
        pointers: [{ name: 'L', idx: left, color: '#f59e0b' }, { name: 'R', idx: right, color: '#ef4444' }],
        variables: { left, right, target, sum: 'N/A' },
        line: 5,
        message: `Initialize pointers: left = ${left}, right = ${right}. Target sum = ${target}.`
      });

      while (left < right) {
        const sum = arr[left] + arr[right];
        
        generated.push({
          array: [...arr],
          pointers: [{ name: 'L', idx: left, color: '#f59e0b' }, { name: 'R', idx: right, color: '#ef4444' }],
          variables: { left, right, target, sum },
          line: 8,
          message: `Compute sum of numbers[left] (${arr[left]}) and numbers[right] (${arr[right]}) = ${sum}.`
        });

        if (sum === target) {
          generated.push({
            array: [...arr],
            pointers: [{ name: 'L', idx: left, color: '#10b981' }, { name: 'R', idx: right, color: '#10b981' }],
            variables: { left, right, target, sum },
            line: 10,
            message: `Sum (${sum}) matches target (${target})! Return 1-based indices: [${left + 1}, ${right + 1}].`
          });
          found = true;
          break;
        } else if (sum < target) {
          left++;
          generated.push({
            array: [...arr],
            pointers: [{ name: 'L', idx: left, color: '#f59e0b' }, { name: 'R', idx: right, color: '#ef4444' }],
            variables: { left, right, target, sum },
            line: 12,
            message: `Sum (${sum}) &lt; target (${target}). Increment left to seek larger elements.`
          });
        } else {
          right--;
          generated.push({
            array: [...arr],
            pointers: [{ name: 'L', idx: left, color: '#f59e0b' }, { name: 'R', idx: right, color: '#ef4444' }],
            variables: { left, right, target, sum },
            line: 14,
            message: `Sum (${sum}) &gt; target (${target}). Decrement right to seek smaller elements.`
          });
        }
      }

      if (!found) {
        generated.push({
          array: [...arr],
          pointers: [],
          variables: { left, right, target },
          line: 17,
          message: `Pointers met. No pair sum matches the target. Return [-1, -1].`
        });
      }
    }
    else if (patternId === 'variable-window') {
      // Variable Sliding Window (Min Size Subarray Sum)
      let minLen = Infinity;
      let sum = 0;
      let left = 0;

      generated.push({
        array: [...arr],
        pointers: [{ name: 'L', idx: left, color: '#f59e0b' }],
        variables: { left, right: 'N/A', sum, minLen: 'Infinity', target },
        line: 5,
        message: `Initialize: left = 0, sum = 0, minLen = Infinity. Target sum = ${target}.`
      });

      for (let right = 0; right < arr.length; right++) {
        sum += arr[right];
        
        generated.push({
          array: [...arr],
          pointers: [{ name: 'L', idx: left, color: '#f59e0b' }, { name: 'R', idx: right, color: '#06b6d4' }],
          variables: { left, right, sum, minLen: minLen === Infinity ? 'Infinity' : minLen, target },
          line: 8,
          message: `Add nums[right] (${arr[right]}) to sum. Current sum is ${sum}. Window spans [${left}..${right}].`
        });

        while (sum >= target) {
          const currentLen = right - left + 1;
          minLen = Math.min(minLen, currentLen);
          
          generated.push({
            array: [...arr],
            pointers: [{ name: 'L', idx: left, color: '#10b981' }, { name: 'R', idx: right, color: '#06b6d4' }],
            variables: { left, right, sum, minLen, target, currentLen },
            line: 12,
            message: `Sum (${sum}) is &gt;= target (${target}). Update minLen = Math.Min(minLen, ${currentLen}) = ${minLen}.`
          });

          sum -= arr[left];
          left++;
          generated.push({
            array: [...arr],
            pointers: [{ name: 'L', idx: left, color: '#f59e0b' }, { name: 'R', idx: right, color: '#06b6d4' }],
            variables: { left, right, sum, minLen, target },
            line: 13,
            message: `Contract left boundary. Subtract nums[left] (${arr[left-1]}) from sum. New sum = ${sum}.`
          });
        }
      }

      generated.push({
        array: [...arr],
        pointers: [],
        variables: { minLen: minLen === Infinity ? 0 : minLen },
        line: 16,
        message: `Sliding window completed. Minimum subarray length is ${minLen === Infinity ? 0 : minLen}.`
      });
    }
    else if (patternId === 'reverse-list') {
      // Reverse Linked List
      const list = arr.length > 0 ? arr : [1, 2, 3, 4, 5];
      let prev = null;
      let curr = 0; // index in values array representing nodes

      generated.push({
        linkedList: { nodes: [...list], prev: null, curr: 0, next: 1, connections: list.map((_, i) => i + 1) },
        variables: { prev: 'null', curr: `Node(${list[0]})`, next: `Node(${list[1]})` },
        line: 5,
        message: `Initialize pointer variables: prev = null, curr = Node(${list[0]}).`
      });

      for (let i = 0; i < list.length; i++) {
        const nextTemp = i + 1 < list.length ? i + 1 : null;
        
        // Step 1: next = curr.next
        generated.push({
          linkedList: { 
            nodes: [...list], 
            prev: prev !== null ? prev : null, 
            curr: i, 
            next: nextTemp,
            connections: list.map((_, idx) => idx === i ? nextTemp : idx + 1) 
          },
          variables: { 
            prev: prev !== null ? `Node(${list[prev]})` : 'null', 
            curr: `Node(${list[i]})`, 
            next: nextTemp !== null ? `Node(${list[nextTemp]})` : 'null' 
          },
          line: 9,
          message: `Save next node: nextTemp = curr.next (${nextTemp !== null ? `Node(${list[nextTemp]})` : 'null'}).`
        });

        // Step 2: curr.next = prev
        const newConnections = list.map((_, idx) => {
          if (idx < i) return idx - 1; // reversed references
          if (idx === i) return prev; // reversed current pointer
          return idx + 1; // normal next references
        });

        generated.push({
          linkedList: { nodes: [...list], prev: prev, curr: i, next: nextTemp, connections: newConnections },
          variables: { 
            prev: prev !== null ? `Node(${list[prev]})` : 'null', 
            curr: `Node(${list[i]})`, 
            next: nextTemp !== null ? `Node(${list[nextTemp]})` : 'null' 
          },
          line: 10,
          message: `Reverse reference link: set curr.next = prev (${prev !== null ? `Node(${list[prev]})` : 'null'}).`
        });

        // Step 3: prev = curr; curr = next;
        prev = i;
        generated.push({
          linkedList: { 
            nodes: [...list], 
            prev: prev, 
            curr: nextTemp, 
            next: nextTemp !== null && nextTemp + 1 < list.length ? nextTemp + 1 : null,
            connections: newConnections 
          },
          variables: { 
            prev: `Node(${list[prev]})`, 
            curr: nextTemp !== null ? `Node(${list[nextTemp]})` : 'null', 
            next: nextTemp !== null && nextTemp + 1 < list.length ? `Node(${list[nextTemp+1]})` : 'null' 
          },
          line: 12,
          message: `Advance pointers: prev = curr (${prev !== null ? `Node(${list[prev]})` : 'null'}), curr = nextTemp.`
        });
      }

      generated.push({
        linkedList: { nodes: [...list], prev: list.length - 1, curr: null, next: null, connections: list.map((_, idx) => idx - 1) },
        variables: { head: `Node(${list[list.length - 1]})` },
        line: 14,
        message: `Linked list is fully reversed. The new head of the list is Node(${list[list.length - 1]}).`
      });
    }
    else if (patternId === 'next-greater-element') {
      // Next Greater Element (Monotonic Stack)
      const stack = [];
      const result = new Array(arr.length).fill(-1);
      
      generated.push({
        array: [...arr],
        stack: [],
        variables: { result: `[${result.join(', ')}]` },
        line: 5,
        message: `Initialize empty stack and result array filled with -1.`
      });

      // Traverse elements
      for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        
        generated.push({
          array: [...arr],
          pointers: [{ name: 'i', idx: i, color: '#06b6d4' }],
          stack: [...stack],
          variables: { result: `[${result.join(', ')}]`, current: val },
          line: 9,
          message: `Scan element at index ${i} (value = ${val}).`
        });

        while (stack.length > 0 && arr[stack[stack.length - 1]] < val) {
          const poppedIdx = stack.pop();
          result[poppedIdx] = val;

          generated.push({
            array: [...arr],
            pointers: [{ name: 'i', idx: i, color: '#06b6d4' }, { name: 'Pop', idx: poppedIdx, color: '#ef4444' }],
            stack: [...stack],
            variables: { result: `[${result.join(', ')}]`, poppedIdx, val },
            line: 10,
            message: `Top of stack element (${arr[poppedIdx]}) is smaller than current val (${val}). Pop index ${poppedIdx} and set its next greater element to ${val}.`
          });
        }

        stack.push(i);
        generated.push({
          array: [...arr],
          pointers: [{ name: 'i', idx: i, color: '#06b6d4' }],
          stack: [...stack],
          variables: { result: `[${result.join(', ')}]` },
          line: 12,
          message: `Push index ${i} (value ${val}) onto the stack.`
        });
      }

      generated.push({
        array: [...arr],
        stack: [],
        variables: { result: `[${result.join(', ')}]` },
        line: 15,
        message: `Scan complete. Final result array is [${result.join(', ')}].`
      });
    }
    else if (patternId === 'brian-kernighan') {
      // Brian Kernighan Bit Counting
      let val = target;
      let count = 0;
      
      const getBinaryStr = (num) => {
        return (num >>> 0).toString(2).padStart(8, '0');
      };

      generated.push({
        bits: { decimal: val, binary: getBinaryStr(val) },
        variables: { val, count },
        line: 5,
        message: `Initialize set bit count = 0. Starting value: ${val} (${getBinaryStr(val)}).`
      });

      while (val !== 0) {
        const oldVal = val;
        val = val & (val - 1);
        count++;

        generated.push({
          bits: { 
            decimal: val, 
            binary: getBinaryStr(val), 
            operation: `${oldVal} & ${oldVal - 1} = ${val}`,
            binaryOp: `${getBinaryStr(oldVal)} & ${getBinaryStr(oldVal - 1)} = ${getBinaryStr(val)}` 
          },
          variables: { val, count },
          line: 7,
          message: `Perform bitwise n = n & (n - 1). This clears the lowest set bit. Increment count to ${count}.`
        });
      }

      generated.push({
        bits: { decimal: 0, binary: '00000000' },
        variables: { count },
        line: 10,
        message: `Value is 0 (all bits cleared). Total set bits count = ${count}.`
      });
    }
    else {
      // Default placeholder frames for other patterns (e.g. Graph, DFS, DP)
      if (patternId === 'tree-dfs' || patternId === 'tree-bfs') {
        // Tree Traversal steps
        const nodes = [1, 2, 3, 4, 5];
        const visits = patternId === 'tree-dfs' ? [1, 2, 4, 5, 3] : [1, 2, 3, 4, 5];
        generated.push({
          tree: { active: null, visited: [] },
          line: 5,
          message: `Initialize Tree Traversal.`
        });
        for (let i = 0; i < visits.length; i++) {
          generated.push({
            tree: { active: visits[i], visited: visits.slice(0, i + 1) },
            line: 9,
            message: `Traverse Node ${visits[i]}.`
          });
        }
      } 
      else if (patternId === 'dijkstra') {
        // Dijkstra graph steps
        const states = [
          { active: 'A', dist: { A: 0, B: Infinity, C: Infinity, D: Infinity } },
          { active: 'A', dist: { A: 0, B: 4, C: 2, D: Infinity } },
          { active: 'C', dist: { A: 0, B: 3, C: 2, D: 6 } },
          { active: 'B', dist: { A: 0, B: 3, C: 2, D: 5 } }
        ];
        states.forEach((s, idx) => {
          generated.push({
            graph: s,
            line: 12 + idx,
            message: `Dijkstra: node active is ${s.active}. Updates distance matrix: ${JSON.stringify(s.dist)}.`
          });
        });
      }
      else if (patternId === '1d-dp') {
        // Coin Change DP table
        const dp = new Array(target + 1).fill(Infinity);
        dp[0] = 0;
        generated.push({
          dpGrid: [...dp],
          line: 5,
          message: `Initialize DP table. Base case dp[0] = 0.`
        });
        
        const coins = [1, 2, 5];
        for (let i = 1; i <= target; i++) {
          let minVal = Infinity;
          coins.forEach(c => {
            if (i - c >= 0) minVal = Math.min(minVal, dp[i - c] + 1);
          });
          dp[i] = minVal;
          generated.push({
            dpGrid: [...dp],
            line: 10,
            message: `Calculate dp[${i}] = Min of matching coins subtracted: dp[${i}] = ${dp[i]}.`
          });
        }
      }
      else {
        // Standard template sequence
        generated.push({
          message: `Starting visual simulation for ${patternId}.`
        });
        generated.push({
          message: `Scanning inputs and executing logic...`
        });
        generated.push({
          message: `Execution complete. Solution found.`
        });
      }
    }

    setFrames(generated);
  };

  const handleNext = () => {
    if (currentFrameIdx < frames.length - 1) {
      setCurrentFrameIdx(currentFrameIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentFrameIdx > 0) {
      setCurrentFrameIdx(currentFrameIdx - 1);
    }
  };

  const currentFrame = frames[currentFrameIdx] || { message: 'Loading simulation...' };

  return (
    <div className="leetcode-visualizer-grid">
      {/* Simulation Visual Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Input Parameters Box */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Configure Simulation Inputs
          </h4>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {patternId !== 'brian-kernighan' && (
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  ARRAY VALUES (COMMA SEPARATED)
                </label>
                <input 
                  type="text" 
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem 0.75rem',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            )}

            {(patternId === 'binary-search' || patternId === 'lower-upper-bound' || patternId === 'opposite-ends' || patternId === 'fixed-window' || patternId === 'variable-window' || patternId === '1d-dp' || patternId === 'brian-kernighan') && (
              <div style={{ width: '120px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  {patternId === 'fixed-window' ? 'WINDOW SIZE K' : patternId === '1d-dp' || patternId === 'brian-kernighan' ? 'AMOUNT / N' : 'TARGET VALUE'}
                </label>
                <input 
                  type="number" 
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem 0.75rem',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Animation Display Board */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          position: 'relative'
        }}>
          
          {/* Array Pointer Renderer */}
          {currentFrame.array && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%', alignItems: 'center' }}>
              {/* Array items */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {currentFrame.array.map((val, idx) => {
                  // Find if pointers are pointing here
                  const activePointers = currentFrame.pointers?.filter(p => p.idx === idx) || [];
                  const isHighlighted = activePointers.length > 0;
                  
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        position: 'relative',
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                      }}
                    >
                      {/* Pointers above */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '-32px', 
                        height: '25px', 
                        display: 'flex', 
                        gap: '2px',
                        zIndex: 2
                      }}>
                        {activePointers.map((p, pidx) => (
                          <span 
                            key={pidx} 
                            style={{ 
                              backgroundColor: p.color, 
                              color: '#fff', 
                              padding: '2px 5px', 
                              borderRadius: '4px', 
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>

                      {/* Element block */}
                      <div 
                        style={{
                          width: '45px',
                          height: '45px',
                          backgroundColor: isHighlighted ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                          border: isHighlighted ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: isHighlighted ? 'var(--accent-color)' : 'var(--text-primary)',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        {val}
                      </div>

                      {/* Index below */}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                        {idx}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Linked List Renderer */}
          {currentFrame.linkedList && (
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {currentFrame.linkedList.nodes.map((val, idx) => {
                const isCurr = currentFrame.linkedList.curr === idx;
                const isPrev = currentFrame.linkedList.prev === idx;
                const isNext = currentFrame.linkedList.next === idx;

                const nextNodeIdx = currentFrame.linkedList.connections[idx];
                const pointsBack = nextNodeIdx !== null && nextNodeIdx < idx;
                const pointsForward = nextNodeIdx !== null && nextNodeIdx > idx;

                return (
                  <React.Fragment key={idx}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {/* Pointers above */}
                      <div style={{ position: 'absolute', top: '-28px', display: 'flex', gap: '3px' }}>
                        {isCurr && <span style={{ backgroundColor: 'var(--accent-color)', color: '#fff', fontSize: '0.65rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>curr</span>}
                        {isPrev && <span style={{ backgroundColor: 'var(--warning)', color: '#fff', fontSize: '0.65rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>prev</span>}
                        {isNext && <span style={{ backgroundColor: 'var(--danger)', color: '#fff', fontSize: '0.65rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>next</span>}
                      </div>
                      
                      {/* Circular Node */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: isCurr ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                        border: isCurr ? '2.5px solid var(--accent-color)' : '1.5px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: isCurr ? 'var(--accent-color)' : 'var(--text-primary)',
                        boxShadow: isCurr ? '0 0 10px var(--accent-glow)' : 'none',
                        zIndex: 1
                      }}>
                        {val}
                      </div>
                    </div>
                    
                    {/* Arrow links */}
                    {idx < currentFrame.linkedList.nodes.length - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', margin: '0 -5px', zIndex: 0 }}>
                        {pointsBack ? (
                          <i className="fa-solid fa-arrow-left-long" style={{ color: 'var(--accent-secondary)', fontSize: '1.1rem' }}></i>
                        ) : pointsForward ? (
                          <i className="fa-solid fa-arrow-right-long" style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}></i>
                        ) : (
                          <span style={{ width: '20px', height: '2px', backgroundColor: 'var(--border-color)' }}></span>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Stack Renderer */}
          {currentFrame.stack && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '1.5rem' }}>
              <div style={{
                width: '120px',
                minHeight: '180px',
                borderLeft: '4px solid var(--border-color)',
                borderRight: '4px solid var(--border-color)',
                borderBottom: '4px solid var(--border-color)',
                borderRadius: '0 0 12px 12px',
                display: 'flex',
                flexDirection: 'column-reverse',
                padding: '8px',
                gap: '6px',
                backgroundColor: 'rgba(0,0,0,0.1)'
              }}>
                {currentFrame.stack.length === 0 ? (
                  <div style={{ margin: 'auto', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontStyle: 'italic' }}>Empty Stack</div>
                ) : (
                  currentFrame.stack.map((itemIdx, idx) => (
                    <div 
                      key={idx}
                      className="fade-in"
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--accent-glow)',
                        border: '1.5px solid var(--accent-color)',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: 'var(--accent-color)'
                      }}
                    >
                      {parseArray(arrayInput)[itemIdx]} <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>(idx {itemIdx})</span>
                    </div>
                  ))
                )}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Monotonic Stack</span>
            </div>
          )}

          {/* Binary Bit Grid Renderer */}
          {currentFrame.bits && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {currentFrame.bits.binary.split('').map((bit, idx) => (
                  <div 
                    key={idx}
                    style={{
                      width: '32px',
                      height: '35px',
                      backgroundColor: bit === '1' ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                      border: bit === '1' ? '1.5px solid var(--accent-color)' : '1px solid var(--border-color)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: bit === '1' ? 'var(--accent-color)' : 'var(--text-tertiary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {bit}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Decimal: <strong>{currentFrame.bits.decimal}</strong>
                {currentFrame.bits.operation && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>
                    {currentFrame.bits.binaryOp}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DP Grid Renderer */}
          {currentFrame.dpGrid && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {currentFrame.dpGrid.map((val, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: val === Infinity ? 'var(--bg-tertiary)' : 'var(--accent-glow)',
                      border: val === Infinity ? '1px solid var(--border-color)' : '1.5px solid var(--accent-color)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: val === Infinity ? 'var(--text-tertiary)' : 'var(--accent-color)'
                    }}>
                      {val === Infinity ? '∞' : val}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>dp[{idx}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tree / Fallback Traversals */}
          {currentFrame.tree && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <svg width="240" height="150" style={{ overflow: 'visible' }}>
                {/* Node connectors */}
                <line x1="120" y1="20" x2="60" y2="70" stroke="var(--border-color)" strokeWidth="2" />
                <line x1="120" y1="20" x2="180" y2="70" stroke="var(--border-color)" strokeWidth="2" />
                <line x1="60" y1="70" x2="30" y2="120" stroke="var(--border-color)" strokeWidth="2" />
                <line x1="60" y1="70" x2="90" y2="120" stroke="var(--border-color)" strokeWidth="2" />
                
                {/* Nodes */}
                {[
                  { id: 1, x: 120, y: 20 },
                  { id: 2, x: 60, y: 70 },
                  { id: 3, x: 180, y: 70 },
                  { id: 4, x: 30, y: 120 },
                  { id: 5, x: 90, y: 120 }
                ].map(n => {
                  const isActive = currentFrame.tree.active === n.id;
                  const isVisited = currentFrame.tree.visited.includes(n.id);
                  return (
                    <g key={n.id}>
                      <circle 
                        cx={n.x} 
                        cy={n.y} 
                        r="18" 
                        fill={isActive ? 'var(--accent-glow)' : isVisited ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)'} 
                        stroke={isActive ? 'var(--accent-color)' : isVisited ? 'var(--success)' : 'var(--border-color)'} 
                        strokeWidth="2" 
                      />
                      <text 
                        x={n.x} 
                        y={n.y + 5} 
                        textAnchor="middle" 
                        fill={isActive ? 'var(--accent-color)' : isVisited ? 'var(--success)' : 'var(--text-primary)'} 
                        fontWeight="bold" 
                        fontSize="12"
                      >
                        {n.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
              {currentFrame.tree.visited.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Visited Order: <strong>{currentFrame.tree.visited.join(' &rarr; ')}</strong>
                </div>
              )}
            </div>
          )}

          {/* Graph visualizer fallback */}
          {currentFrame.graph && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <svg width="250" height="150" style={{ overflow: 'visible' }}>
                {/* Connectors with weights */}
                <line x1="40" y1="75" x2="120" y2="30" stroke="var(--border-color)" strokeWidth="2" />
                <text x="75" y="45" fill="var(--text-tertiary)" fontSize="11" fontWeight="bold">4</text>
                
                <line x1="40" y1="75" x2="120" y2="120" stroke="var(--border-color)" strokeWidth="2" />
                <text x="75" y="110" fill="var(--text-tertiary)" fontSize="11" fontWeight="bold">2</text>
                
                <line x1="120" y1="30" x2="120" y2="120" stroke="var(--border-color)" strokeWidth="2" />
                <text x="125" y="78" fill="var(--text-tertiary)" fontSize="11" fontWeight="bold">3</text>
                
                <line x1="120" y1="30" x2="200" y2="75" stroke="var(--border-color)" strokeWidth="2" />
                <text x="165" y="45" fill="var(--text-tertiary)" fontSize="11" fontWeight="bold">3</text>

                <line x1="120" y1="120" x2="200" y2="75" stroke="var(--border-color)" strokeWidth="2" />
                <text x="165" y="110" fill="var(--text-tertiary)" fontSize="11" fontWeight="bold">1</text>
                
                {/* Nodes */}
                {[
                  { name: 'A', x: 40, y: 75 },
                  { name: 'B', x: 120, y: 30 },
                  { name: 'C', x: 120, y: 120 },
                  { name: 'D', x: 200, y: 75 }
                ].map(n => {
                  const isActive = currentFrame.graph.active === n.name;
                  const distVal = currentFrame.graph.dist[n.name];
                  const formattedDist = distVal === Infinity ? '∞' : distVal;
                  
                  return (
                    <g key={n.name}>
                      <circle 
                        cx={n.x} 
                        cy={n.y} 
                        r="18" 
                        fill={isActive ? 'var(--accent-glow)' : 'var(--bg-tertiary)'} 
                        stroke={isActive ? 'var(--accent-color)' : 'var(--border-color)'} 
                        strokeWidth="2" 
                      />
                      <text x={n.x} y={n.y + 4} textAnchor="middle" fill="var(--text-primary)" fontWeight="bold" fontSize="11">{n.name}</text>
                      <text x={n.x} y={n.y + 32} textAnchor="middle" fill="var(--text-secondary)" fontSize="10">dist: {formattedDist}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Simple Fallback Step Logger */}
          {!currentFrame.array && !currentFrame.linkedList && !currentFrame.stack && !currentFrame.bits && !currentFrame.dpGrid && !currentFrame.tree && !currentFrame.graph && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--text-tertiary)' }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '3rem', color: 'var(--accent-color)', opacity: 0.8 }}></i>
              <span style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>Visualizing: {patternId}</span>
            </div>
          )}
        </div>

        {/* Step Logger Status */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderLeft: '4px solid var(--accent-color)',
          borderRadius: '0 12px 12px 0',
          padding: '1.25rem',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.92rem',
          color: 'var(--text-primary)',
          lineHeight: '1.5',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div dangerouslySetInnerHTML={{ __html: currentFrame.message }} />
        </div>

        {/* Playback Controls Toolbar */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="nav-btn" 
              onClick={() => { setCurrentFrameIdx(0); setIsPlaying(false); }}
              disabled={currentFrameIdx === 0}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
              title="Reset to beginning"
            >
              <i className="fa-solid fa-arrow-rotate-left"></i>
            </button>
            <button 
              className="nav-btn" 
              onClick={handlePrev}
              disabled={currentFrameIdx === 0}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
              title="Previous step"
            >
              <i className="fa-solid fa-backward-step"></i>
            </button>
            <button 
              className="nav-btn" 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.8rem', 
                backgroundColor: isPlaying ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                borderColor: isPlaying ? 'var(--accent-color)' : 'var(--border-color)',
                color: isPlaying ? 'var(--accent-color)' : 'var(--text-primary)'
              }}
              title={isPlaying ? "Pause simulation" : "Auto-play simulation"}
            >
              {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
              <span style={{ marginLeft: '5px' }}>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button 
              className="nav-btn" 
              onClick={handleNext}
              disabled={currentFrameIdx === frames.length - 1}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
              title="Next step"
            >
              <i className="fa-solid fa-forward-step"></i>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '250px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
              STEP {currentFrameIdx + 1} / {frames.length}
            </span>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                backgroundColor: 'var(--accent-color)',
                width: `${frames.length > 0 ? ((currentFrameIdx + 1) / frames.length) * 100 : 0}%`,
                borderRadius: '2px',
                transition: 'width 0.2s'
              }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>SPEED</span>
            <select 
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <option value={1500}>0.5x</option>
              <option value={1000}>1.0x</option>
              <option value={500}>2.0x</option>
            </select>
          </div>
        </div>

        {/* Variables State Inspector Card */}
        {currentFrame.variables && Object.keys(currentFrame.variables).length > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-terminal" style={{ color: 'var(--accent-color)' }}></i> Local variables / State Inspector
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
              {Object.entries(currentFrame.variables).map(([name, val]) => (
                <div key={name} style={{ backgroundColor: 'var(--bg-primary)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{name}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {val.toString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Code Side Pane */}
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fa-solid fa-code-fork" style={{ color: 'var(--accent-color)' }}></i> Dynamic Execution Trace
        </h4>
        <CsharpCodeBlock code={csharpCode} highlightLine={currentFrame.line} />
      </div>
    </div>
  );
}
