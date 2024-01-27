import java.util.Arrays;

/**
 * Minimum runtime: Java 8
 */
public class Number4 {

    public static void main(String[] args) {
        int[][] matrix = {{1, 2, 0}, {4, 5, 6}, {7, 8, 9}};
        int result = subtractSumDiagonal(matrix);

        System.out.println("Matrix:");
        for (int[] ints : matrix)
            System.out.println(Arrays.toString(ints));
        System.out.printf("Result: %d\n", result);
    }

    public static int subtractSumDiagonal(int[][] matrix) {
        int sumLeft = 0;
        for (int i = 0; i < matrix.length; i++) {
            sumLeft += matrix[i][i];
        }

        int sumRight = 0;
        for (int i = 0; i < matrix.length; i++) {
            sumRight += matrix[i][(matrix[i].length - 1) - i];
        }

        return sumLeft - sumRight;
    }
}
