def count_subarrays(N, A):
    # Initialize variables to count subarrays with at least one even element
    count_with_op = 0
    count_without_op = 0

    # Count subarrays without performing the operation
    for i in range(N):
        if A[i] % 2 == 0:
            count_without_op += (N - i)

    # Count subarrays after performing the operation
    for i in range(N):
        if A[i] % 2 == 0:
            count_with_op += (N - i)
        else:
            if i == N - 1 or A[i + 1] % 2 == 0:
                count_with_op += (N - i)
            else:
                count_with_op += (N - 1 - i)

    return max(count_with_op, count_without_op)

# Read the number of test cases
T = int(input())
for _ in range(T):
    # Read the size of the array
    N = int(input())
    # Read the array elements
    A = list(map(int, input().split()))
    # Call the count_subarrays function and print the result
    print(count_subarrays(N, A))
