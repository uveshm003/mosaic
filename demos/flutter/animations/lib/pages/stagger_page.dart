import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

/// One controller drives every row; each row takes its own slice of the timeline.
class StaggerPage extends StatefulWidget {
  const StaggerPage({super.key});

  @override
  State<StaggerPage> createState() => _StaggerPageState();
}

const _rows = [
  ('Site visit, Harbour Road', 'Synced', Icons.cloud_done_outlined),
  ('Meter photos (12)', 'Uploading', Icons.cloud_upload_outlined),
  ('Safety checklist', 'Done', Icons.check_circle_outline),
  ('Signature from client', 'Waiting', Icons.draw_outlined),
  ('Follow-up visit', 'Scheduled', Icons.event_outlined),
  ('Parts order #2041', 'Shipped', Icons.local_shipping_outlined),
  ('Weekly report', 'Draft', Icons.description_outlined),
];

class _StaggerPageState extends State<StaggerPage>
    with SingleTickerProviderStateMixin {
  late final _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  )..forward();
  var _overlap = 0.5;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// The slice of the timeline row [i] animates in. Each row lasts [d]; the next
  /// starts once (1 - overlap) of it has passed, and the last one ends at 1.
  Interval interval(int i) {
    final d = 1 / ((_rows.length - 1) * (1 - _overlap) + 1);
    final start = i * d * (1 - _overlap);
    return Interval(
      start,
      (start + d).clamp(0.0, 1.0),
      curve: Curves.easeOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return PageBody(
      children: [
        Text('Staggered list', style: text.headlineSmall),
        const SizedBox(height: 4),
        Text(
          'One AnimationController, one Interval per row.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            const Text('Overlap'),
            Expanded(
              child: Slider(
                max: 0.9,
                divisions: 9,
                value: _overlap,
                label: _overlap.toStringAsFixed(1),
                onChanged: (v) => setState(() => _overlap = v),
                onChangeEnd: (_) => _controller.forward(from: 0),
              ),
            ),
            FilledButton.icon(
              onPressed: () => _controller.forward(from: 0),
              icon: const Icon(Icons.replay),
              label: const Text('Replay'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Card(
          child: Column(
            children: [
              for (final (i, (title, status, icon)) in _rows.indexed)
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    final t = interval(i).transform(_controller.value);
                    return Opacity(
                      opacity: t,
                      child: Transform.translate(
                        offset: Offset(0, 24 * (1 - t)),
                        child: child,
                      ),
                    );
                  },
                  child: ListTile(
                    leading: Icon(icon, color: DemoColors.mint),
                    title: Text(title),
                    trailing: Text(
                      status,
                      style: text.labelMedium?.copyWith(
                        color: DemoColors.muted,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        CodeBlock(
          'final row = CurvedAnimation(\n'
          '  parent: controller,\n'
          '  curve: Interval(start, start + step, curve: Curves.easeOutCubic),\n'
          ');\n'
          '// overlap: ${_overlap.toStringAsFixed(1)} (0 = one after another)',
        ),
      ],
    );
  }
}
