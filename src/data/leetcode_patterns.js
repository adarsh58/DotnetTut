// LeetCode Algorithm Patterns Database for C# and Interactive Visualizer

export const categories = [
  {
    id: "arrays-basic",
    title: "Arrays & Basic Patterns",
    icon: "fa-list-ol",
    patterns: [
      {
        id: "traversal",
        title: "Traversal & Linear Scan",
        description: "Iterating through an array elements to inspect, filter, or aggregate data in O(N) time.",
        whyUsed: "Used when every element must be visited at least once, or for simple search queries in unsorted data.",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Find Maximum Element",
          problem: "Given an array of integers, find the maximum element in a single pass.",
          csharp: `public int FindMax(int[] nums) {
    if (nums == null || nums.Length == 0) 
        throw new ArgumentException("Array cannot be empty");
        
    int max = nums[0];
    for (int i = 1; i < nums.Length; i++) {
        if (nums[i] > max) {
            max = nums[i]; // Update current max
        }
    }
    return max;
}`
        }
      },
      {
        id: "prefix-sum",
        title: "Prefix Sum",
        description: "Preprocessing an array to compute cumulative sums, allowing range sum queries in O(1) time.",
        whyUsed: "Optimal for answering multiple sum queries over arbitrary subarrays `[i, j]` without re-iterating.",
        complexity: "Time: O(N) preprocessing, O(1) query | Space: O(N) prefix array",
        example: {
          title: "Range Sum Query - Immutable (LeetCode 303)",
          problem: "Design a data structure that supports fast range sum queries on an array.",
          csharp: `public class NumArray {
    private int[] prefixSums;

    public NumArray(int[] nums) {
        prefixSums = new int[nums.Length + 1];
        for (int i = 0; i < nums.Length; i++) {
            prefixSums[i + 1] = prefixSums[i] + nums[i];
        }
    }
    
    public int SumRange(int left, int right) {
        // Sum from left to right is prefixSums[right+1] - prefixSums[left]
        return prefixSums[right + 1] - prefixSums[left];
    }
}`
        }
      },
      {
        id: "difference-array",
        title: "Difference Array",
        description: "An auxiliary array recording differences between adjacent elements, used to apply range updates in O(1) time.",
        whyUsed: "Used when you need to perform multiple range increments `nums[i..j] += val` and query the final state.",
        complexity: "Time: O(1) per update, O(N) to rebuild | Space: O(N)",
        example: {
          title: "Range Addition (LeetCode 370)",
          problem: "Apply multiple range updates `(start, end, val)` on an initialized zero array.",
          csharp: `public int[] GetModifiedArray(int length, int[][] updates) {
    int[] diff = new int[length];
    foreach (var update in updates) {
        int start = update[0];
        int end = update[1];
        int val = update[2];
        
        diff[start] += val;
        if (end + 1 < length) {
            diff[end + 1] -= val;
        }
    }
    
    // Accumulate to get final array
    for (int i = 1; i < length; i++) {
        diff[i] += diff[i - 1];
    }
    return diff;
}`
        }
      },
      {
        id: "kadane",
        title: "Kadane's Algorithm",
        description: "A dynamic programming heuristic to find the maximum sum contiguous subarray in linear time.",
        whyUsed: "Used when searching for the most profitable interval in a sequence (e.g. stock prices, temperature changes).",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Maximum Subarray (LeetCode 53)",
          problem: "Find the contiguous subarray (containing at least one number) which has the largest sum.",
          csharp: `public int MaxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    
    for (int i = 1; i < nums.Length; i++) {
        // Choose to extend current subarray or start a new one from nums[i]
        currentMax = Math.Max(nums[i], currentMax + nums[i]);
        maxSoFar = Math.Max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`
        }
      },
      {
        id: "boyer-moore",
        title: "Boyer-Moore Majority Vote",
        description: "An algorithm to find the majority element (appearing > N/2 times) in O(N) time and O(1) space.",
        whyUsed: "Used for stream processing and consensus detection where memory is severely constrained.",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Majority Element (LeetCode 169)",
          problem: "Find the element that appears more than ⌊n/2⌋ times in the array.",
          csharp: `public int MajorityElement(int[] nums) {
    int count = 0;
    int candidate = 0;
    
    foreach (int num in nums) {
        if (count == 0) {
            candidate = num;
        }
        count += (num == candidate) ? 1 : -1;
    }
    return candidate;
}`
        }
      },
      {
        id: "dutch-national-flag",
        title: "Dutch National Flag (3-Way Partition)",
        description: "Partitioning an array of 3 distinct values (e.g., 0, 1, 2) in-place in a single linear pass.",
        whyUsed: "Ideal for sorting small domains or partitioning pivots in QuickSort to handle duplicates efficiently.",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Sort Colors (LeetCode 75)",
          problem: "Sort an array of 0s, 1s, and 2s in-place in linear time.",
          csharp: `public void SortColors(int[] nums) {
    int low = 0, mid = 0;
    int high = nums.Length - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            Swap(nums, low++, mid++);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            Swap(nums, mid, high--);
        }
    }
}

private void Swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}`
        }
      },
      {
        id: "monotonic-array",
        title: "Monotonic Array",
        description: "Verifying if an array is entirely non-increasing or non-decreasing.",
        whyUsed: "Used as a preprocessing check or for validating sorted order properties in pipelines.",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Monotonic Array (LeetCode 896)",
          problem: "Determine if an array is monotonic.",
          csharp: `public bool IsMonotonic(int[] nums) {
    bool increasing = true;
    bool decreasing = true;
    
    for (int i = 0; i < nums.Length - 1; i++) {
        if (nums[i] > nums[i + 1]) increasing = false;
        if (nums[i] < nums[i + 1]) decreasing = false;
    }
    return increasing || decreasing;
}`
        }
      },
      {
        id: "coordinate-compression",
        title: "Coordinate Compression",
        description: "Mapping a large range of coordinates to a smaller, dense set of index integers.",
        whyUsed: "Necessary when coordinates span [0, 1e9] but only N <= 10^5 elements exist, enabling range trees/arrays.",
        complexity: "Time: O(N log N) | Space: O(N)",
        example: {
          title: "Compress Coordinates",
          problem: "Map arbitrary coordinates to dense rank indices `0` to `M-1`.",
          csharp: `public int[] Compress(int[] coords) {
    // Obtain unique sorted values
    int[] sortedUnique = coords.Distinct().ToArray();
    Array.Sort(sortedUnique);
    
    int[] compressed = new int[coords.Length];
    for (int i = 0; i < coords.Length; i++) {
        // Binary search to find rank index
        compressed[i] = Array.BinarySearch(sortedUnique, coords[i]);
    }
    return compressed;
}`
        }
      }
    ]
  },
  {
    id: "sorting-searching",
    title: "Sorting & Searching",
    icon: "fa-search",
    patterns: [
      {
        id: "binary-search",
        title: "Binary Search",
        description: "Dividing a sorted search space in half at each step to find an element in logarithmic time.",
        whyUsed: "Used to avoid linear scans on sorted arrays, converting O(N) search into O(log N).",
        complexity: "Time: O(log N) | Space: O(1)",
        example: {
          title: "Binary Search (LeetCode 704)",
          problem: "Find the index of a target value in a sorted array.",
          csharp: `public int Search(int[] nums, int target) {
    int low = 0;
    int high = nums.Length - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevent integer overflow
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
        }
      },
      {
        id: "binary-search-on-answer",
        title: "Binary Search on Answer",
        description: "Applying binary search on the potential output range, verifying feasibility of the midpoint in O(N).",
        whyUsed: "Used when the search space is bounded, and checking whether a threshold 'x' is valid is easy (monotonic property).",
        complexity: "Time: O(N log M) | Space: O(1)",
        example: {
          title: "Koko Eating Bananas (LeetCode 875)",
          problem: "Find the minimum speed K to eat all bananas within H hours.",
          csharp: `public int MinEatingSpeed(int[] piles, int h) {
    int low = 1;
    int high = piles.Max();
    int ans = high;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (CanEatAll(piles, h, mid)) {
            ans = mid;
            high = mid - 1; // Try to find a slower speed
        } else {
            low = mid + 1; // Speed too slow, increase it
        }
    }
    return ans;
}

private bool CanEatAll(int[] piles, int h, int speed) {
    long hoursNeeded = 0;
    foreach (int pile in piles) {
        hoursNeeded += (pile + speed - 1) / speed; // Ceiling division
    }
    return hoursNeeded <= h;
}`
        }
      },
      {
        id: "lower-upper-bound",
        title: "Lower Bound / Upper Bound",
        description: "Binary search variations to find the first element >= target (lower) or > target (upper).",
        whyUsed: "Used to determine ranges of duplicates or insertion points in sorted collections.",
        complexity: "Time: O(log N) | Space: O(1)",
        example: {
          title: "Search Range (LeetCode 34)",
          problem: "Find starting and ending position of a target in sorted array.",
          csharp: `public int[] SearchRange(int[] nums, int target) {
    int first = FindBound(nums, target, true);
    if (first == -1) return new int[] { -1, -1 };
    int last = FindBound(nums, target, false);
    return new int[] { first, last };
}

private int FindBound(int[] nums, int target, bool isFirst) {
    int low = 0, high = nums.Length - 1, bound = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            bound = mid;
            if (isFirst) high = mid - 1; // Narrow down left
            else low = mid + 1; // Narrow down right
        } else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return bound;
}`
        }
      },
      {
        id: "quick-sort",
        title: "Quick Sort",
        description: "Divide-and-conquer sorting by choosing a pivot, partitioning values, and sorting subsegments.",
        whyUsed: "Highly efficient in-place sort with low cache overhead and fast average execution.",
        complexity: "Time: O(N log N) average, O(N^2) worst | Space: O(log N) recursion depth",
        example: {
          title: "Quick Sort Implementation",
          problem: "Sort an array of elements in ascending order using QuickSort.",
          csharp: `public void QuickSort(int[] nums) {
    Sort(nums, 0, nums.Length - 1);
}

private void Sort(int[] nums, int low, int high) {
    if (low < high) {
        int pivotIdx = Partition(nums, low, high);
        Sort(nums, low, pivotIdx - 1);
        Sort(nums, pivotIdx + 1, high);
    }
}

private int Partition(int[] nums, int low, int high) {
    int pivot = nums[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (nums[j] < pivot) {
            Swap(nums, ++i, j);
        }
    }
    Swap(nums, i + 1, high);
    return i + 1;
}`
        }
      },
      {
        id: "merge-sort",
        title: "Merge Sort",
        description: "Stable divide-and-conquer algorithm that recursively splits the array, sorts halves, and merges them.",
        whyUsed: "Used when stability is required (preserving relative order of equals) or for external sorting of massive datasets.",
        complexity: "Time: O(N log N) guaranteed | Space: O(N) auxiliary memory",
        example: {
          title: "Merge Sort Implementation",
          problem: "Sort an array stably using Merge Sort.",
          csharp: `public void MergeSort(int[] nums) {
    Sort(nums, 0, nums.Length - 1, new int[nums.Length]);
}

private void Sort(int[] nums, int left, int right, int[] temp) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    Sort(nums, left, mid, temp);
    Sort(nums, mid + 1, right, temp);
    Merge(nums, left, mid, right, temp);
}

private void Merge(int[] nums, int left, int mid, int right, int[] temp) {
    int i = left, j = mid + 1, k = left;
    while (i <= mid && j <= right) {
        temp[k++] = (nums[i] <= nums[j]) ? nums[i++] : nums[j++];
    }
    while (i <= mid) temp[k++] = nums[i++];
    while (j <= right) temp[k++] = nums[j++];
    for (i = left; i <= right; i++) nums[i] = temp[i];
}`
        }
      }
    ]
  },
  {
    id: "two-pointers",
    title: "Two-Pointer Variants",
    icon: "fa-arrows-left-right",
    patterns: [
      {
        id: "opposite-ends",
        title: "Opposite Ends Pointers",
        description: "Starting pointers at index 0 and N-1, moving them inward based on condition criteria.",
        whyUsed: "Commonly used on sorted arrays to search pairs (e.g. Two Sum II) or to reverse segments in-place.",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Two Sum II - Input Sorted (LeetCode 167)",
          problem: "Find two numbers in a sorted array that add up to a target.",
          csharp: `public int[] TwoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.Length - 1;
    
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[] { left + 1, right + 1 }; // 1-based index
        } else if (sum < target) {
            left++; // Need a larger sum
        } else {
            right--; // Need a smaller sum
        }
    }
    return new int[] { -1, -1 };
}`
        }
      },
      {
        id: "fast-slow-pointer",
        title: "Fast-Slow Pointer (Floyd's Cycle)",
        description: "Moving two pointers at different speeds (e.g., 1x and 2x) through lists or structures.",
        whyUsed: "Used to detect cycles or find midpoints in linked lists without storing history.",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Linked List Cycle (LeetCode 141)",
          problem: "Determine if a linked list contains a loop/cycle.",
          csharp: `public bool HasCycle(ListNode head) {
    if (head == null) return false;
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;        // 1 step
        fast = fast.next.next;   // 2 steps
        if (slow == fast) return true; // Cycle detected
    }
    return false;
}`
        }
      },
      {
        id: "expand-center",
        title: "Expand Around Center",
        description: "Starting pointers at identical index and expanding outwards to find symmetric structures.",
        whyUsed: "Used to find palindromes in strings since palindromes are symmetric around their middle characters.",
        complexity: "Time: O(N^2) | Space: O(1)",
        example: {
          title: "Longest Palindromic Substring (LeetCode 5)",
          problem: "Find the longest palindromic substring in a string S.",
          csharp: `public string LongestPalindrome(string s) {
    if (string.IsNullOrEmpty(s)) return "";
    int start = 0, end = 0;
    
    for (int i = 0; i < s.Length; i++) {
        int len1 = Expand(s, i, i);     // Odd lengths like "aba"
        int len2 = Expand(s, i, i + 1); // Even lengths like "abba"
        int len = Math.Max(len1, len2);
        
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.Substring(start, end - start + 1);
}

private int Expand(string s, int left, int right) {
    while (left >= 0 && right < s.Length && s[left] == s[right]) {
        left--;
        right++;
    }
    return right - left - 1; // Return length of palindrome
}`
        }
      },
      {
        id: "merge-intervals",
        title: "Merge Intervals",
        description: "Sorting intervals by start time and merging overlapping boundaries sequentially.",
        whyUsed: "Used in calendar scheduling, resource allocations, and overlapping range consolidations.",
        complexity: "Time: O(N log N) sorting, O(N) merge | Space: O(N) or O(log N) for sort stack",
        example: {
          title: "Merge Intervals (LeetCode 56)",
          problem: "Merge all overlapping intervals.",
          csharp: `public int[][] Merge(int[][] intervals) {
    if (intervals.Length <= 1) return intervals;
    
    // Sort intervals by start value
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
    
    var merged = new List<int[]>();
    int[] current = intervals[0];
    merged.Add(current);
    
    foreach (var interval in intervals) {
        int currentEnd = current[1];
        int nextStart = interval[0];
        int nextEnd = interval[1];
        
        if (currentEnd >= nextStart) {
            // Overlap, update the end boundary
            current[1] = Math.Max(currentEnd, nextEnd);
        } else {
            // No overlap, move to next interval
            current = interval;
            merged.Add(current);
        }
    }
    return merged.ToArray();
}`
        }
      }
    ]
  },
  {
    id: "sliding-window",
    title: "Sliding Window Patterns",
    icon: "fa-square-caret-right",
    patterns: [
      {
        id: "fixed-window",
        title: "Fixed Size Window",
        description: "Maintaining a window of size K as it slides from left to right across the sequence.",
        whyUsed: "Used to calculate rolling metrics (averages, duplicate counts, maxes) of size K in O(1) step time.",
        complexity: "Time: O(N) | Space: O(K) or O(1)",
        example: {
          title: "Maximum Sum Subarray of Size K",
          problem: "Find the maximum sum of a contiguous subarray of size K.",
          csharp: `public int MaxSubarraySum(int[] nums, int k) {
    if (nums.Length < k) return 0;
    
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i]; // First window
    }
    
    int maxSum = windowSum;
    for (int i = k; i < nums.Length; i++) {
        // Slide: add new element, subtract outgoing element
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.Max(maxSum, windowSum);
    }
    return maxSum;
}`
        }
      },
      {
        id: "variable-window",
        title: "Variable Size Window",
        description: "Expanding the right pointer to ingest elements, contracting the left pointer when constraints are violated.",
        whyUsed: "Used to find optimal (longest/shortest) subarrays matching criteria (e.g. unique characters, target sum).",
        complexity: "Time: O(N) since each pointer moves at most N times | Space: O(K) where K is unique keys",
        example: {
          title: "Minimum Size Subarray Sum (LeetCode 209)",
          problem: "Find the minimal length of a subarray whose sum is >= target.",
          csharp: `public int MinSubArrayLen(int target, int[] nums) {
    int minLength = int.MaxValue;
    int sum = 0;
    int left = 0;
    
    for (int right = 0; right < nums.Length; right++) {
        sum += nums[right]; // Expand window
        
        // Shrink window while condition met
        while (sum >= target) {
            minLength = Math.Min(minLength, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLength == int.MaxValue ? 0 : minLength;
}`
        }
      },
      {
        id: "sliding-window-maximum",
        title: "Sliding Window Maximum (Deque)",
        description: "Using a double-ended queue (Deque) to store indices of monotonic decreasing candidate maximums of size K.",
        whyUsed: "Used when standard heap approaches are too slow (O(N log K)), solving maximum of all sliding windows in strict O(N).",
        complexity: "Time: O(N) | Space: O(K) queue space",
        example: {
          title: "Sliding Window Maximum (LeetCode 239)",
          problem: "Return the max element in each sliding window of size K.",
          csharp: `public int[] MaxSlidingWindow(int[] nums, int k) {
    int n = nums.Length;
    int[] result = new int[n - k + 1];
    var deque = new LinkedList<int>(); // Store indices
    
    for (int i = 0; i < n; i++) {
        // Remove indices outside current window
        if (deque.Count > 0 && deque.First.Value < i - k + 1) {
            deque.RemoveFirst();
        }
        
        // Maintain monotonic decreasing order (remove smaller values)
        while (deque.Count > 0 && nums[deque.Last.Value] < nums[i]) {
            deque.RemoveLast();
        }
        
        deque.AddLast(i);
        
        // Record max of window
        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.First.Value];
        }
    }
    return result;
}`
        }
      }
    ]
  },
  {
    id: "linked-list",
    title: "Linked Lists",
    icon: "fa-link",
    patterns: [
      {
        id: "reverse-list",
        title: "Reverse Linked List",
        description: "Reversing pointers in-place by swapping next references node-by-node.",
        whyUsed: "Core manipulation pattern to flip ordering without allocating O(N) additional structures.",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Reverse Linked List (LeetCode 206)",
          problem: "Reverse a singly linked list in-place.",
          csharp: `public ListNode ReverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    
    while (curr != null) {
        ListNode nextTemp = curr.next; // Store next node
        curr.next = prev;              // Reverse reference
        prev = curr;                   // Move prev forward
        curr = nextTemp;               // Move curr forward
    }
    return prev; // New head
}`
        }
      },
      {
        id: "dummy-node",
        title: "Dummy Node Technique",
        description: "Creating a temporary placeholder sentinel node at the head of the list.",
        whyUsed: "Used to simplify edge cases where the head of the list changes dynamically (e.g. deletion, merging).",
        complexity: "Time: O(N) | Space: O(1)",
        example: {
          title: "Remove Nth Node From End (LeetCode 19)",
          problem: "Remove the N-th node from the end of list.",
          csharp: `public ListNode RemoveNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode first = dummy;
    ListNode second = dummy;
    
    // Move first pointer n+1 steps ahead
    for (int i = 1; i <= n + 1; i++) {
        first = first.next;
    }
    
    // Move both pointers until first reaches the end
    while (first != null) {
        first = first.next;
        second = second.next;
    }
    
    // Bypass the target node
    second.next = second.next.next;
    return dummy.next;
}`
        }
      }
    ]
  },
  {
    id: "stack-patterns",
    title: "Stack Patterns",
    icon: "fa-layer-group",
    patterns: [
      {
        id: "parentheses-matching",
        title: "Parentheses Matching",
        description: "Using a stack to match corresponding open and close brackets in linear time.",
        whyUsed: "Pushes open tokens to the stack and pops them upon matching closes. Handles nesting validation perfectly.",
        complexity: "Time: O(N) | Space: O(N)",
        example: {
          title: "Valid Parentheses (LeetCode 20)",
          problem: "Determine if bracket sequences are nested correctly.",
          csharp: `public bool IsValid(string s) {
    var stack = new Stack<char>();
    foreach (char c in s) {
        if (c == '(' || c == '{' || c == '[') {
            stack.Push(c);
        } else {
            if (stack.Count == 0) return false;
            char top = stack.Pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return stack.Count == 0;
}`
        }
      },
      {
        id: "next-greater-element",
        title: "Monotonic Stack (Next Greater Element)",
        description: "Maintaining indices in a strict monotonic sorted order inside a stack to find nearest larger elements.",
        whyUsed: "Used to optimize nested-loop comparisons (O(N^2)) down to a single pass (O(N)) for structural elements.",
        complexity: "Time: O(N) | Space: O(N)",
        example: {
          title: "Next Greater Element II (LeetCode 503)",
          problem: "Find the next greater element in a circular array.",
          csharp: `public int[] NextGreaterElements(int[] nums) {
    int n = nums.Length;
    int[] result = new int[n];
    Array.Fill(result, -1);
    var stack = new Stack<int>(); // Stores indices
    
    // Traverse twice to handle circular queries
    for (int i = 0; i < 2 * n; i++) {
        int num = nums[i % n];
        while (stack.Count > 0 && nums[stack.Peek()] < num) {
            result[stack.Pop()] = num;
        }
        if (i < n) {
            stack.Push(i);
        }
    }
    return result;
}`
        }
      }
    ]
  },
  {
    id: "queue-deque",
    title: "Queue & Deque",
    icon: "fa-exchange",
    patterns: [
      {
        id: "circular-queue",
        title: "Circular Queue",
        description: "Implementing a queue using a fixed-size array and head/tail index wrappers.",
        whyUsed: "Avoids memory reallocation overhead, ideal for buffered network streams or ring buffers.",
        complexity: "Time: O(1) operations | Space: O(K) allocation size",
        example: {
          title: "Design Circular Queue (LeetCode 622)",
          problem: "Implement a circular queue structure.",
          csharp: `public class MyCircularQueue {
    private int[] data;
    private int head = -1, tail = -1, size = 0;

    public MyCircularQueue(int k) {
        data = new int[k];
        size = k;
    }
    
    public bool EnQueue(int value) {
        if (IsFull()) return false;
        if (IsEmpty()) head = 0;
        tail = (tail + 1) % size;
        data[tail] = value;
        return true;
    }
    
    public bool DeQueue() {
        if (IsEmpty()) return false;
        if (head == tail) {
            head = -1; tail = -1; // Reset empty
        } else {
            head = (head + 1) % size;
        }
        return true;
    }
    
    public int Front() => IsEmpty() ? -1 : data[head];
    public int Rear() => IsEmpty() ? -1 : data[tail];
    public bool IsEmpty() => head == -1;
    public bool IsFull() => ((tail + 1) % size) == head;
}`
        }
      }
    ]
  },
  {
    id: "trees",
    title: "Trees & Traversals",
    icon: "fa-tree",
    patterns: [
      {
        id: "tree-dfs",
        title: "Depth First Search (DFS)",
        description: "Recursively traversing down node branches (Inorder, Preorder, Postorder) using execution stack.",
        whyUsed: "Used to evaluate binary search trees, construct path matches, and search all paths in hierarchies.",
        complexity: "Time: O(N) | Space: O(H) call stack height",
        example: {
          title: "Inorder Traversal (LeetCode 94)",
          problem: "Retrieve node values in order of Left-Root-Right.",
          csharp: `public IList<int> InorderTraversal(TreeNode root) {
    var result = new List<int>();
    DFS(root, result);
    return result;
}

private void DFS(TreeNode node, List<int> result) {
    if (node == null) return;
    
    DFS(node.left, result);    // Traverse Left
    result.Add(node.val);      // Process Root
    DFS(node.right, result);   // Traverse Right
}`
        }
      },
      {
        id: "tree-bfs",
        title: "Breadth First Search (Level Order)",
        description: "Traversing tree levels iteratively using a queue to process all nodes at depth `d` before `d+1`.",
        whyUsed: "Used to find shortest paths or group nodes by their depth layer.",
        complexity: "Time: O(N) | Space: O(W) where W is max width of tree",
        example: {
          title: "Binary Tree Level Order Traversal (LeetCode 102)",
          problem: "Group binary tree node values level-by-level.",
          csharp: `public IList<IList<int>> LevelOrder(TreeNode root) {
    var result = new List<IList<int>>();
    if (root == null) return result;
    
    var queue = new Queue<TreeNode>();
    queue.Enqueue(root);
    
    while (queue.Count > 0) {
        int levelSize = queue.Count;
        var level = new List<int>();
        
        for (int i = 0; i < levelSize; i++) {
            var curr = queue.Dequeue();
            level.Add(curr.val);
            
            if (curr.left != null) queue.Enqueue(curr.left);
            if (curr.right != null) queue.Enqueue(curr.right);
        }
        result.Add(level);
    }
    return result;
}`
        }
      },
      {
        id: "lca",
        title: "Lowest Common Ancestor (LCA)",
        description: "Finding the deepest node in a tree that has both nodes `p` and `q` as descendants.",
        whyUsed: "Core algorithm in query indexes, folder path hierarchies, and relationship lookups.",
        complexity: "Time: O(N) | Space: O(H)",
        example: {
          title: "Lowest Common Ancestor (LeetCode 236)",
          problem: "Find the lowest common ancestor of two nodes p and q.",
          csharp: `public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    
    TreeNode left = LowestCommonAncestor(root.left, p, q);
    TreeNode right = LowestCommonAncestor(root.right, p, q);
    
    if (left != null && right != null) return root; // Root separates p and q
    return left != null ? left : right; // P and Q exist in one subtree
}`
        }
      }
    ]
  },
  {
    id: "bst",
    title: "Binary Search Trees",
    icon: "fa-network-wired",
    patterns: [
      {
        id: "bst-validation",
        title: "BST Validation",
        description: "Checking whether a tree satisfies binary search requirements (every left node < root < right node) using boundaries.",
        whyUsed: "Used to verify indices, integrity databases, and ensure search runtime guarantees remain O(log N).",
        complexity: "Time: O(N) | Space: O(H)",
        example: {
          title: "Validate Binary Search Tree (LeetCode 98)",
          problem: "Check if a tree is a valid BST.",
          csharp: `public bool IsValidBST(TreeNode root) {
    return Validate(root, null, null);
}

private bool Validate(TreeNode node, long? min, long? max) {
    if (node == null) return true;
    
    if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
        return false;
    }
    
    // Recurse left with upper boundary, right with lower boundary
    return Validate(node.left, min, node.val) && Validate(node.right, node.val, max);
}`
        }
      }
    ]
  },
  {
    id: "graph-algorithms",
    title: "Graph Algorithms",
    icon: "fa-project-diagram",
    patterns: [
      {
        id: "union-find",
        title: "Union Find (Disjoint Set Union)",
        description: "A tracking system managing partitions of elements, optimized with union-by-rank and path compression.",
        whyUsed: "Used to determine connectivity, cycle detection in undirected graphs, and building MSTs in near-constant time.",
        complexity: "Time: O(α(N)) operations (inverse Ackermann) | Space: O(N)",
        example: {
          title: "Number of Connected Components (LeetCode 323)",
          problem: "Find the total count of distinct subgraphs in an undirected graph.",
          csharp: `public class DSU {
    private int[] parent;
    private int[] rank;
    public int Count { get; private set; }
    
    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        Count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    
    public int Find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = Find(parent[i]); // Path compression
    }
    
    public bool Union(int i, int j) {
        int rootI = Find(i);
        int rootJ = Find(j);
        if (rootI == rootJ) return false; // Already connected
        
        // Union by rank
        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
        } else {
            parent[rootJ] = rootI;
            rank[rootI]++;
        }
        Count--;
        return true;
    }
}`
        }
      },
      {
        id: "dijkstra",
        title: "Dijkstra's Algorithm",
        description: "Single-source shortest path algorithm on positive weighted graphs using a Min-Priority Queue.",
        whyUsed: "Used in GPS, routing tables, and mapping directions to find optimal distance path in O(E log V).",
        complexity: "Time: O(E log V) | Space: O(V + E)",
        example: {
          title: "Network Delay Time (LeetCode 743)",
          problem: "Find minimum time for signal to reach all nodes from source K.",
          csharp: `public int NetworkDelayTime(int[][] times, int n, int k) {
    // Build adjacency list
    var adj = new Dictionary<int, List<(int node, int weight)>>();
    for (int i = 1; i <= n; i++) adj[i] = new List<(int, int)>();
    foreach (var edge in times) adj[edge[0]].Add((edge[1], edge[2]));
    
    // Min-Priority Queue tracking (distance, node)
    var pq = new PriorityQueue<int, int>();
    var dist = new Dictionary<int, int>();
    
    pq.Enqueue(k, 0);
    dist[k] = 0;
    
    while (pq.Count > 0) {
        pq.TryDequeue(out int currNode, out int currDist);
        
        if (currDist > dist.GetValueOrDefault(currNode, int.MaxValue)) continue;
        
        foreach (var edge in adj[currNode]) {
            int nextNode = edge.node;
            int weight = edge.weight;
            int nextDist = currDist + weight;
            
            if (nextDist < dist.GetValueOrDefault(nextNode, int.MaxValue)) {
                dist[nextNode] = nextDist;
                pq.Enqueue(nextNode, nextDist);
            }
        }
    }
    
    if (dist.Count < n) return -1;
    return dist.Values.Max();
}`
        }
      }
    ]
  },
  {
    id: "backtracking",
    title: "Backtracking",
    icon: "fa-undo",
    patterns: [
      {
        id: "subsets",
        title: "Subsets Generation",
        description: "Exploring all combinations (power set) of a collection using decision tree recursion.",
        whyUsed: "Used when the entire search space of configurations must be evaluated (combinations, combinatorial optimization).",
        complexity: "Time: O(2^N * N) | Space: O(N) stack size",
        example: {
          title: "Subsets (LeetCode 78)",
          problem: "Generate all possible subset combinations.",
          csharp: `public IList<IList<int>> Subsets(int[] nums) {
    var result = new List<IList<int>>();
    Backtrack(nums, 0, new List<int>(), result);
    return result;
}

private void Backtrack(int[] nums, int start, List<int> current, List<IList<int>> result) {
    result.Add(new List<int>(current)); // Capture current state
    
    for (int i = start; i < nums.Length; i++) {
        current.Add(nums[i]); // Choose
        Backtrack(nums, i + 1, current, result); // Explore
        current.RemoveAt(current.Count - 1); // Backtrack
    }
}`
        }
      },
      {
        id: "n-queens",
        title: "N-Queens Puzzle",
        description: "Solving queen configuration placement on an N x N grid such that no two queens attack each other.",
        whyUsed: "Classic constraints puzzle showing prune search trees dynamically through row, column, and diagonal validation lists.",
        complexity: "Time: O(N!) | Space: O(N)",
        example: {
          title: "N-Queens (LeetCode 51)",
          problem: "Return all distinct board representations for N-Queens.",
          csharp: `public IList<IList<string>> SolveNQueens(int n) {
    var result = new List<IList<string>>();
    var board = new char[n][];
    for (int i = 0; i < n; i++) {
        board[i] = new char[n];
        Array.Fill(board[i], '.');
    }
    
    var cols = new HashSet<int>();
    var diag1 = new HashSet<int>(); // r - c
    var diag2 = new HashSet<int>(); // r + c
    
    Backtrack(0, n, board, result, cols, diag1, diag2);
    return result;
}

private void Backtrack(int r, int n, char[][] board, List<IList<string>> res, 
                       HashSet<int> cols, HashSet<int> d1, HashSet<int> d2) {
    if (r == n) {
        res.Add(board.Select(row => new string(row)).ToList());
        return;
    }
    
    for (int c = 0; c < n; c++) {
        if (cols.Contains(c) || d1.Contains(r - c) || d2.Contains(r + c)) continue;
        
        board[r][c] = 'Q';
        cols.Add(c); d1.Add(r - c); d2.Add(r + c);
        
        Backtrack(r + 1, n, board, res, cols, d1, d2);
        
        board[r][c] = '.'; // Backtrack
        cols.Remove(c); d1.Remove(r - c); d2.Remove(r + c);
    }
}`
        }
      }
    ]
  },
  {
    id: "dp",
    title: "Dynamic Programming (DP)",
    icon: "fa-chess-board",
    patterns: [
      {
        id: "1d-dp",
        title: "1D Dynamic Programming",
        description: "Breaking down complex sequential optimization into a 1D state transition table (Memoization/Tabulation).",
        whyUsed: "Replaces exponential recursion by storing overlapping subproblems in memory.",
        complexity: "Time: O(N) | Space: O(N) down to O(1) with optimization",
        example: {
          title: "Coin Change (LeetCode 322)",
          problem: "Find fewest coins needed to make up a target amount.",
          csharp: `public int CoinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Array.Fill(dp, amount + 1);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        foreach (int coin in coins) {
            if (i - coin >= 0) {
                // Min coins for remainder + 1 for current coin
                dp[i] = Math.Min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`
        }
      },
      {
        id: "2d-dp",
        title: "2D Dynamic Programming (Knapsack/LCS)",
        description: "Optimizing grid pathways, string matchings (LCS, Edit Distance), and selections (Knapsack) using 2D state arrays.",
        whyUsed: "Used when the solution at step `(i, j)` depends on historical choices made along two dimensions.",
        complexity: "Time: O(N*M) | Space: O(N*M)",
        example: {
          title: "Unique Paths (LeetCode 62)",
          problem: "Calculate total paths from top-left to bottom-right of an M x N grid.",
          csharp: `public int UniquePaths(int m, int n) {
    int[,] dp = new int[m, n];
    
    // Initialize border edges to 1 (only 1 path to reach them)
    for (int i = 0; i < m; i++) dp[i, 0] = 1;
    for (int j = 0; j < n; j++) dp[0, j] = 1;
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            // Paths from top + paths from left
            dp[i, j] = dp[i - 1, j] + dp[i, j - 1];
        }
    }
    return dp[m - 1, n - 1];
}`
        }
      }
    ]
  },
  {
    id: "greedy",
    title: "Greedy Algorithms",
    icon: "fa-hand-holding-dollar",
    patterns: [
      {
        id: "interval-scheduling",
        title: "Interval Scheduling / Jump Game",
        description: "Making locally optimal choices at each step, hoping it leads to a global optimum.",
        whyUsed: "Extremely fast execution on sorted datasets where local optimal choices are proven mathematically to yield global optimum.",
        complexity: "Time: O(N) or O(N log N) | Space: O(1)",
        example: {
          title: "Jump Game (LeetCode 55)",
          problem: "Verify if you can reach the final index from starting position.",
          csharp: `public bool CanJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.Length; i++) {
        if (i > maxReach) return false; // Cannot reach this index
        maxReach = Math.Max(maxReach, i + nums[i]);
    }
    return true;
}`
        }
      }
    ]
  },
  {
    id: "heap-pq",
    title: "Heap & Priority Queue",
    icon: "fa-sort-amount-up",
    patterns: [
      {
        id: "top-k",
        title: "Top K Elements",
        description: "Using a size-K Min-Heap to collect the largest elements in stream datasets.",
        whyUsed: "Avoids sorting the entire O(N) array, maintaining a streaming output set in O(N log K) time.",
        complexity: "Time: O(N log K) | Space: O(K)",
        example: {
          title: "Kth Largest Element (LeetCode 215)",
          problem: "Retrieve the K-th largest number in unsorted array.",
          csharp: `public int FindKthLargest(int[] nums, int k) {
    var pq = new PriorityQueue<int, int>(); // Min-heap behavior
    foreach (int num in nums) {
        pq.Enqueue(num, num);
        if (pq.Count > k) {
            pq.Dequeue(); // Evict smallest element
        }
    }
    return pq.Peek(); // Top is Kth largest
}`
        }
      }
    ]
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    icon: "fa-binary",
    patterns: [
      {
        id: "brian-kernighan",
        title: "Brian Kernighan's Algorithm",
        description: "Clearing the lowest set bit in an integer using `n = n & (n - 1)`.",
        whyUsed: "Used to count set bits (Hamming weight) in a number in O(set bits) time rather than O(32) iterations.",
        complexity: "Time: O(K) where K is count of 1-bits | Space: O(1)",
        example: {
          title: "Number of 1 Bits (LeetCode 191)",
          problem: "Count set bits in an integer.",
          csharp: `public int HammingWeight(uint n) {
    int count = 0;
    while (n != 0) {
        n = n & (n - 1); // Clears the lowest set bit
        count++;
    }
    return count;
}`
        }
      }
    ]
  },
  {
    id: "string-algorithms",
    title: "String Algorithms",
    icon: "fa-font",
    patterns: [
      {
        id: "trie",
        title: "Trie (Prefix Tree)",
        description: "N-ary tree structure storing string prefixes for rapid autocomplete and retrieval.",
        whyUsed: "Used for search engine suggestions, spell checking, and prefix matching in strict O(L) where L is query length.",
        complexity: "Time: O(L) insertion/search | Space: O(Alphabet_Size * L * N)",
        example: {
          title: "Implement Trie (LeetCode 208)",
          problem: "Design a Prefix Tree structure.",
          csharp: `public class TrieNode {
    public TrieNode[] children = new TrieNode[26];
    public bool isEndOfWord = false;
}

public class Trie {
    private TrieNode root = new TrieNode();

    public void Insert(string word) {
        TrieNode curr = root;
        foreach (char c in word) {
            int idx = c - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new TrieNode();
            }
            curr = curr.children[idx];
        }
        curr.isEndOfWord = true;
    }
    
    public bool Search(string word) {
        TrieNode node = GetNode(word);
        return node != null && node.isEndOfWord;
    }
    
    public bool StartsWith(string prefix) {
        return GetNode(prefix) != null;
    }
    
    private TrieNode GetNode(string s) {
        TrieNode curr = root;
        foreach (char c in s) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return null;
            curr = curr.children[idx];
        }
        return curr;
    }
}`
        }
      },
      {
        id: "kmp",
        title: "Knuth-Morris-Pratt (KMP)",
        description: "Linear time substring searching by analyzing pattern prefixes (LPS array) to skip redundant evaluations.",
        whyUsed: "Used to search text matches in O(N+M) without resetting matching pointers back to square one.",
        complexity: "Time: O(N + M) | Space: O(M) for LPS array",
        example: {
          title: "Find Index of First Substring (LeetCode 28)",
          problem: "Match substring needle in haystack.",
          csharp: `public int StrStr(string haystack, string needle) {
    if (needle.Length == 0) return 0;
    int[] lps = BuildLPS(needle);
    int i = 0, j = 0;
    
    while (i < haystack.Length) {
        if (haystack[i] == needle[j]) {
            i++; j++;
        }
        if (j == needle.Length) {
            return i - j; // Match index
        } else if (i < haystack.Length && haystack[i] != needle[j]) {
            if (j != 0) j = lps[j - 1]; // Use LPS to skip checks
            else i++;
        }
    }
    return -1;
}

private int[] BuildLPS(string pattern) {
    int[] lps = new int[pattern.Length];
    int len = 0, i = 1;
    while (i < pattern.Length) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else {
            if (len != 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
    }
    return lps;
}`
        }
      }
    ]
  },
  {
    id: "math-theory",
    title: "Math & Number Theory",
    icon: "fa-calculator",
    patterns: [
      {
        id: "sieve",
        title: "Sieve of Eratosthenes",
        description: "Marking multiples of primes sequentially to extract all primes up to range N.",
        whyUsed: "Most efficient method to count or find all primes under N, far outperforming O(N sqrt(N)) trial divisions.",
        complexity: "Time: O(N log log N) | Space: O(N) lookup array",
        example: {
          title: "Count Primes (LeetCode 204)",
          problem: "Count the number of prime numbers strictly less than N.",
          csharp: `public int CountPrimes(int n) {
    if (n <= 2) return 0;
    bool[] isPrime = new bool[n];
    Array.Fill(isPrime, true);
    
    for (int i = 2; i * i < n; i++) {
        if (isPrime[i]) {
            // Mark all multiples starting from i*i
            for (int j = i * i; j < n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (isPrime[i]) count++;
    }
    return count;
}`
        }
      }
    ]
  },
  {
    id: "advanced-topics",
    title: "Advanced Topics",
    icon: "fa-crown",
    patterns: [
      {
        id: "segment-tree",
        title: "Segment Tree",
        description: "A binary tree recording range parameters, allowing logarithmic interval updates and queries.",
        whyUsed: "Used when both range queries and range edits/mutations must execute concurrently in O(log N).",
        complexity: "Time: O(log N) per query/update, O(N) build | Space: O(N) memory storage",
        example: {
          title: "Range Sum Query - Mutable (LeetCode 307)",
          problem: "Handle values updates and range queries simultaneously.",
          csharp: `public class SegmentTree {
    private int[] tree;
    private int n;

    public SegmentTree(int[] nums) {
        n = nums.Length;
        tree = new int[4 * n];
        Build(nums, 0, 0, n - 1);
    }
    
    private void Build(int[] nums, int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
            return;
        }
        int mid = start + (end - start) / 2;
        Build(nums, 2 * node + 1, start, mid);
        Build(nums, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
    
    public void Update(int index, int val) => Update(0, 0, n - 1, index, val);
    
    private void Update(int node, int start, int end, int index, int val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        int mid = start + (end - start) / 2;
        if (index <= mid) Update(2 * node + 1, start, mid, index, val);
        else Update(2 * node + 2, mid + 1, end, index, val);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
    
    public int Query(int l, int r) => Query(0, 0, n - 1, l, r);
    
    private int Query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0; // Completely outside
        if (l <= start && end <= r) return tree[node]; // Completely inside
        
        int mid = start + (end - start) / 2;
        return Query(2 * node + 1, start, mid, l, r) + 
               Query(2 * node + 2, mid + 1, end, l, r);
    }
}`
        }
      }
    ]
  }
];
