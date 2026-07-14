import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
  const logs = [];
  try {
    logs.push("Khởi động trình đồng bộ GitHub...");

    // Lấy tên nhánh hiện tại
    const branchRes = await execPromise('git branch --show-current');
    const branchName = branchRes.stdout.trim() || 'main';
    logs.push(`Đang ở nhánh: ${branchName}`);

    // git add
    logs.push("Đang chạy: git add .");
    const addResult = await execPromise('git add .');
    if (addResult.stdout) logs.push(addResult.stdout);
    
    // git commit
    const commitMsg = `Cap nhat thiep cuoi - ${new Date().toLocaleString('vi-VN')}`;
    logs.push(`Đang chạy: git commit -m "${commitMsg}"`);
    try {
      const commitResult = await execPromise(`git commit -m "${commitMsg}"`);
      if (commitResult.stdout) logs.push(commitResult.stdout);
    } catch (commitErr) {
      // Trường hợp không có thay đổi
      if (commitErr.stdout && (commitErr.stdout.includes("nothing to commit") || commitErr.stdout.includes("nothing added to commit"))) {
        logs.push("Không có thay đổi mới nào để commit.");
      } else {
        throw commitErr;
      }
    }

    // git push
    logs.push(`Đang chạy: git push origin ${branchName}`);
    const pushResult = await execPromise(`git push origin ${branchName}`);
    if (pushResult.stdout) logs.push(pushResult.stdout);
    if (pushResult.stderr) logs.push(pushResult.stderr);

    logs.push("Đồng bộ GitHub thành công tốt đẹp!");
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    logs.push(`Lỗi: ${error.message}`);
    return NextResponse.json({ success: false, error: error.message, logs }, { status: 500 });
  }
}
