#!/bin/bash
# ============================================
# 部署脚本：上传 JAR + 前端产物，并重启服务
# 用法:
#   ./deploy.sh root@<host> [服务名]
#   例如: ./deploy.sh root@192.168.1.100
# ============================================

set -e

# ---------- 配置 ----------
SERVER="${1:?请提供服务器地址，例如: root@192.168.1.100}"
SERVICE_NAME="${2:-base-admin}"                          # systemd 服务名，默认 base-admin
JAR_LOCAL="BackEnd/target/base-admin-1.0.0.jar"          # 本地 jar 路径
JAR_REMOTE="/opt/app/base-admin-1.0.0.jar"               # 远端 jar 路径
FRONTEND_LOCAL="FrontEnd/dist/"                          # 本地前端目录
FRONTEND_REMOTE="/usr/share/nginx/html/"                 # 远端 nginx 目录
CTL_PATH="~/.ssh/ctl/%r@%h:%p"                           # SSH 连接复用 socket 路径

# 建立 SSH 长连接（只需输一次密码，后续命令复用）
mkdir -p ~/.ssh/ctl
ssh -M -S "${CTL_PATH}" -o "ControlPersist=60" -N -f "${SERVER}" 2>/dev/null || true

# 定义统一的 ssh/scp 参数
SSH_CMD="ssh -o ControlPath=${CTL_PATH}"
SCP_CMD="scp -o ControlPath=${CTL_PATH}"

# 脚本退出时自动关闭长连接
cleanup() { ssh -o ControlPath="${CTL_PATH}" -O exit "${SERVER}" 2>/dev/null; }
trap cleanup EXIT

echo "========================================"
echo "  开始部署到 ${SERVER}"
echo "========================================"

# ---------- 1. 上传前端 ----------
echo ""
echo "[1/4] 上传前端文件..."
echo "  本地: ${FRONTEND_LOCAL}"
echo "  远端: ${FRONTEND_REMOTE}"

${SSH_CMD} "${SERVER}" "rm -rf ${FRONTEND_REMOTE}*"
${SCP_CMD} -r ${FRONTEND_LOCAL}* "${SERVER}:${FRONTEND_REMOTE}"

echo "  ✓ 前端上传完成"

# ---------- 2. 上传后端 JAR ----------
echo ""
echo "[2/4] 上传后端 JAR..."
echo "  本地: ${JAR_LOCAL}"
echo "  远端: ${JAR_REMOTE}"

${SCP_CMD} "${JAR_LOCAL}" "${SERVER}:${JAR_REMOTE}"

echo "  ✓ JAR 上传完成"

# ---------- 3. 重启后端服务 ----------
echo ""
echo "[3/4] 重启后端服务 (${SERVICE_NAME})..."

${SSH_CMD} "${SERVER}" "systemctl restart ${SERVICE_NAME}"

sleep 3

if ${SSH_CMD} "${SERVER}" "systemctl is-active --quiet ${SERVICE_NAME}"; then
    echo "  ✓ 后端服务已启动"
else
    echo "  ✗ 后端服务启动失败！请检查日志: journalctl -u ${SERVICE_NAME} -n 50"
    exit 1
fi

# ---------- 4. 重载 Nginx ----------
echo ""
echo "[4/4] 重载 Nginx..."

${SSH_CMD} "${SERVER}" "nginx -t && nginx -s reload"

echo "  ✓ Nginx 已重载"

# ---------- 完成 ----------
echo ""
echo "========================================"
echo "  部署完成！"
echo "========================================"
echo ""
echo "验证命令:"
echo "  后端状态: systemctl status ${SERVICE_NAME}"
echo "  后端日志: journalctl -u ${SERVICE_NAME} -f"
echo "  Nginx 日志: tail -f /var/log/nginx/access.log"
