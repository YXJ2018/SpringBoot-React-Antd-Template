import { cloneDeep } from 'lodash-es';

const tools = {
  /**
   * 处理ProTable组件Request方法分页默认值，current改为pageNum,请根据后端接口规范自行定义
   * @param params 查询参数
   * @returns
   */
  handleSearchParams(params: Record<string, any>) {
    const { current, ...rest } = cloneDeep(params);
    return { ...rest, pageNum: current };
  },
};

export default tools;
