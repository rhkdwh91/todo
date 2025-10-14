import { test, expect } from '@playwright/test';

const INPUT_PLACEHOLDER = '새로운 할 일을 입력하세요';

test.describe('Todo 앱', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // LocalStorage를 빈 배열로 초기화 (기본 데이터 제거)
    await page.evaluate(() => {
      localStorage.setItem('msw-todos', JSON.stringify([]));
    });
    await page.reload();
    // MSW가 초기화되고 페이지가 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
  });

  test('할 일 생성', async ({ page }) => {
    // 할 일 입력
    const input = page.locator('input[placeholder="새로운 할 일을 입력하세요"]');
    await input.fill('Playwright 테스트 작성');

    // Enter 키로 제출
    await input.press('Enter');

    // 할 일이 목록에 표시되는지 확인 (ID가 앞에 붙으므로 포함 여부 확인)
    await expect(page.getByText('Playwright 테스트 작성', { exact: false })).toBeVisible();
  });

  test('할 일 완료 처리', async ({ page }) => {
    // 할 일 추가
    const input = page.locator(`input[placeholder="${INPUT_PLACEHOLDER}"]`);
    await input.fill('완료할 작업');
    await input.press('Enter');

    // 체크박스 클릭
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();

    // 체크박스가 체크되었는지 확인
    await expect(checkbox).toBeChecked();
  });

  test('할 일 수정', async ({ page }) => {
    // 할 일 추가
    const input = page.locator(`input[placeholder="${INPUT_PLACEHOLDER}"]`);
    await input.fill('수정할 작업');
    await input.press('Enter');

    // 할 일이 표시될 때까지 대기
    await expect(page.getByText('수정할 작업', { exact: false })).toBeVisible();

    // 할 일 항목 찾기 (수정 버튼 클릭 전에 찾아야 함)
    const todoItem = page.locator('[class*="item"]').first();

    // 수정 버튼 클릭
    await todoItem.locator('button:has-text("수정")').click();

    // 편집 폼이 나타날 때까지 대기
    await todoItem.locator('[class*="editForm"]').waitFor({ state: 'visible' });

    // 입력 필드 수정 - autoFocus가 있으므로 focused input 찾기
    const editInput = page.locator('input:focus');
    await editInput.fill('수정된 작업');

    // Enter 키로 저장
    await editInput.press('Enter');

    // 수정된 텍스트가 표시되는지 확인
    await expect(page.getByText('수정된 작업', { exact: false })).toBeVisible();
  });

  test('할 일 삭제', async ({ page }) => {
    // 할 일 추가
    const input = page.locator(`input[placeholder="${INPUT_PLACEHOLDER}"]`);
    await input.fill('삭제할 작업');
    await input.press('Enter');

    // 삭제 확인을 위한 dialog 핸들러 등록
    page.on('dialog', (dialog) => dialog.accept());

    // 삭제 버튼 클릭
    await page.locator('button:has-text("삭제")').first().click();

    // 할 일이 사라졌는지 확인
    await expect(page.getByText('삭제할 작업', { exact: false })).not.toBeVisible();
  });

  test('참조 기능 - 참조된 할 일이 완료되지 않으면 완료 불가', async ({ page }) => {
    // 첫 번째 할 일 추가
    const input = page.locator(`input[placeholder="${INPUT_PLACEHOLDER}"]`);
    await input.fill('기본 작업');
    await input.press('Enter');

    // 첫 번째 할 일이 표시될 때까지 대기
    await expect(page.getByText('기본 작업', { exact: false })).toBeVisible();

    // 두 번째 할 일 추가 (첫 번째 할 일 참조)
    await input.fill('의존 작업');

    // 참조 선택 영역 펼치기
    await page.locator('button:has-text("펼치기")').click();

    // 참조 선택 영역의 첫 번째 할 일 체크박스 선택 (기본 작업)
    const referenceCheckbox = page.locator('label:has-text("기본 작업")').locator('input[type="checkbox"]');
    await referenceCheckbox.click();

    // 체크박스가 선택되었는지 확인
    await expect(referenceCheckbox).toBeChecked();

    // Enter 키로 할 일 추가
    await input.press('Enter');

    // 두 번째 할 일이 표시될 때까지 대기 - ID 포함된 텍스트로 확인
    await expect(page.getByText('2. 의존 작업', { exact: false })).toBeVisible();

    // 두 번째 할 일의 완료 체크박스가 비활성화되었는지 확인
    // TodoList 영역에서 "2. 의존 작업" 텍스트를 포함하는 할 일 항목의 체크박스 찾기
    const secondTodoItem = page.locator('[class*="item"]').filter({ hasText: '2. 의존 작업' });
    const secondCheckbox = secondTodoItem.locator('input[type="checkbox"]').first();
    await expect(secondCheckbox).toBeDisabled();
  });

  test('필터링 - Active 필터', async ({ page }) => {
    // 할 일 2개 추가
    const input = page.locator(`input[placeholder="${INPUT_PLACEHOLDER}"]`);
    await input.fill('작업 1');
    await input.press('Enter');

    // 첫 번째 할 일이 표시될 때까지 대기
    await expect(page.getByText('작업 1', { exact: false })).toBeVisible();

    await input.fill('작업 2');
    await input.press('Enter');

    // 두 번째 할 일이 표시될 때까지 대기
    await expect(page.getByText('작업 2', { exact: false })).toBeVisible();

    // 첫 번째 할 일의 체크박스를 찾아서 완료 처리
    const firstTodoItem = page.locator('[class*="item"]').filter({ hasText: '작업 1' });
    const firstCheckbox = firstTodoItem.locator('input[type="checkbox"]').first();
    await firstCheckbox.click();

    // 체크박스가 체크될 때까지 대기
    await expect(firstCheckbox).toBeChecked();

    // Active 필터 클릭
    await page.locator('button:has-text("Active")').click();

    // 완료되지 않은 할 일만 표시되는지 확인
    await expect(page.getByText('작업 2', { exact: false })).toBeVisible();
    await expect(page.getByText('작업 1', { exact: false })).not.toBeVisible();
  });

  test('필터링 - Completed 필터', async ({ page }) => {
    // 할 일 2개 추가
    const input = page.locator(`input[placeholder="${INPUT_PLACEHOLDER}"]`);
    await input.fill('작업 1');
    await input.press('Enter');

    // 첫 번째 할 일이 표시될 때까지 대기
    await expect(page.getByText('작업 1', { exact: false })).toBeVisible();

    await input.fill('작업 2');
    await input.press('Enter');

    // 두 번째 할 일이 표시될 때까지 대기
    await expect(page.getByText('작업 2', { exact: false })).toBeVisible();

    // 첫 번째 할 일의 체크박스를 찾아서 완료 처리
    const firstTodoItem = page.locator('[class*="item"]').filter({ hasText: '작업 1' });
    const firstCheckbox = firstTodoItem.locator('input[type="checkbox"]').first();
    await firstCheckbox.click();

    // 체크박스가 체크될 때까지 대기
    await expect(firstCheckbox).toBeChecked();

    // Completed 필터 클릭
    await page.locator('button:has-text("Completed")').click();

    // 완료된 할 일만 표시되는지 확인
    await expect(page.getByText('작업 1', { exact: false })).toBeVisible();
    await expect(page.getByText('작업 2', { exact: false })).not.toBeVisible();
  });
});
